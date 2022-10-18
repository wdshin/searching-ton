import TonWeb from "tonweb"
import {
  JettonApi,
  DNSApi,
  NFTApi,
  RawBlockchainApi,
  SubscriptionApi,
  TraceApi,
  WalletApi,
  Configuration,
} from "tonapi-sdk-js"
import db from "../db/index"
import axios from "axios"
import { getTonProxy } from "./helpers"

const dnsApi = new DNSApi()
interface SearchNFTItemsParams {
  limit: number
  offset: number
}

const getFullUrl = (dmn: string) => `http://${dmn}`

interface UpsertDmnParams {
  available: boolean
  walletAddress?: string
  tonBalance?: string
}
const upsertDmn = async (
  dmn: string,
  { available, tonBalance, walletAddress }: UpsertDmnParams
) => {
  const domainFromDB = await db.nftDomain.findFirst({ where: { address: getFullUrl(dmn) } })
  const shouldUpdateFirstAvailableDate = !domainFromDB?.firstAvailableDate && available

  const upsertObj = { available, address: getFullUrl(dmn), domainName: dmn, walletAddress, tonBalance  }
  
  if (shouldUpdateFirstAvailableDate) {
    upsertObj.firstAvailableDate = new Date()
  }
  return await db.nftDomain.upsert({
    where: {
      address: getFullUrl(dmn),
    },
    update: upsertObj,
    create: upsertObj,
  })
}

const wait = (time: number) => new Promise((resolve) => setTimeout(() => resolve(true), time))

const searchNFTItems = async ({ limit, offset }: SearchNFTItemsParams) => {
  try {
    console.log(`Start search limit:${limit}, offset:${offset}`)
    await wait(1000)
    const { data } = await axios.get(
      `https://tonapi.io/v1/nft/searchItems?collection=EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz&include_on_sale=false&limit=${limit}&offset=${offset}`,
      {
        headers: {
          // 'Authorization': 'Bearer '+ '6c456b1e31217a79e121dcb9b506c280358d58bc86659bdbac1d737bfc3691fb',
        },
      }
    )
    return data.nft_items
  } catch (e) {
    console.log("error fetch items", e)
    return searchNFTItems({ limit, offset })
  }
}

const portion = 1000

const fetchTonSite = async (url: string) => {
  try {
    const urlToFetch = `http://${url}/`
    const response = await axios.get(urlToFetch, {
      proxy: getTonProxy(),
    })
    if (!response.data) {
      console.log("Error fetch")
      throw "err"
    }
    return url
  } catch (e) {
    // console.log('restart fetch domains',e)
    throw url
  }
}

const tonweb = new TonWeb(
  new TonWeb.HttpProvider("https://toncenter.com/api/v2/jsonRPC", {
    apiKey: "2594e0a460095b81258b639950a16d9718fa3cbb1ba8a2eb87fbb4586a529b8f",
  })
)

const fetchDomainInfo = async (url: string, count=0) => {
  try {
    await wait(1)

    const address = (await tonweb.dns.getWalletAddress(url))?.toString(true, true, true)

    let balance
    if (address) {
      balance = tonweb.utils.fromNano(await tonweb.getBalance(address))
      console.log('Success domain info', url)
      return {
        balance,
        address,
      }
    }
    console.log('There is no domain info', url)
    return null
  } catch (e) {
    if(count < 10){
      console.log('Failed fetch domain info', count,url, e)
      await wait(Math.floor(Math.random() * 10)+5)
      return await fetchDomainInfo(url, count++)
    }
    return null
  }
}

const main = async () =>
  new Promise(async (resolve) => {
    // const result = await tonweb.dns.getWalletAddress('just-for-test.ton')
    // Receive typed array of owner nfts
    let count = 0
    while (true) {
      // в nftItems 1000 сайтов
      const nftItems = await searchNFTItems({
        limit: portion,
        offset: count * portion,
      })
      if (nftItems.length) {
        const promises1: Promise<unknown>[] = []
        for (let i = 0; i < nftItems.length; i++) {
          const nftDomainItem = nftItems[i]
          if (nftDomainItem.dns) {
            promises1.push(
              fetchTonSite(nftDomainItem.dns)
                .then(async (dmn) => {
                  const domainInfo = await fetchDomainInfo(dmn)
                  console.log("success dmn", dmn)
                  upsertDmn(dmn, {available: true, walletAddress:domainInfo?.address, tonBalance:domainInfo?.balance})
                })
                .catch((dmn) => {
                  upsertDmn(dmn, {available: false})
                })
            )
          }
        }
        count++
        await Promise.all(promises1)
        continue
      }
      break
    }

    console.log("Finish fetch nft")
    setTimeout(() => {
      resolve(true)
    }, 3000)
  })

export default main
