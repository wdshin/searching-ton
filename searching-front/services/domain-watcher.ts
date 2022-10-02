
import tonweb from "tonweb"
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


interface SearchNFTItemsParams {
  limit: number
  offset: number
}

const wait = (time:number) => new Promise((resolve)=>setTimeout(()=>resolve(true),time )) 

const searchNFTItems = async ({ limit, offset }: SearchNFTItemsParams) => {
  try{

  
  console.log(`Start search limit:${limit}, offset:${offset}`)
  await wait(1000)
  const { data } = await axios.get(
    `https://tonapi.io/v1/nft/searchItems?collection=EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz&include_on_sale=false&limit=${limit}&offset=${offset}`,
    {
      headers:{
        // 'Authorization': 'Bearer '+ '6c456b1e31217a79e121dcb9b506c280358d58bc86659bdbac1d737bfc3691fb',
      }
    }
  ) 
  return data.nft_items
} catch (e){
  return searchNFTItems({ limit, offset })
}
}

const portion = 1000

const fetchTonSite = async (url: string) => {
  const urlToFetch = `http://${url}/`
  const response = await axios.get(urlToFetch, {
    proxy: getTonProxy(),
  })
  if (!response.data) {
    console.log("Error fetch")
    throw "error"
  }
  return url
}

const main = async () => new Promise(async (resolve)=>{
  // Receive typed array of owner nfts
  let count = 0
  while (true) {
    // в nftItems 1000 сайтов
    const nftItems = await searchNFTItems({
      limit: portion,
      offset: count * portion,
    })

    if (nftItems.length) {
      for (let i = 0; i < nftItems.length; i++) {
        const nftDomainItem = nftItems[i]
        if (nftDomainItem.dns) {
          fetchTonSite(nftDomainItem.dns)
            .then(async (dmn) => {
              console.log("success dmn", dmn)
              await db.nftDomain.upsert({
                where: {
                  address: `http://${dmn}`,
                },
                update: { available: false, address: `http://${dmn}` },
                create: { available: false, address: `http://${dmn}` },
              })
            })
            .catch(() => {})
        }
      }
      count++
      continue
    }
    break
  }
  console.log('Finish fetch nft')
  setTimeout(()=>{resolve(true)}, 10000)
})

export default main
