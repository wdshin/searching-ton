import dotenv from "dotenv"
import path from "path"
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
dotenv.config({ path: path.resolve(__dirname, "../.env.local") })
import db from "../db/index"
import axios from "axios"

const nftApi = new NFTApi()

const DOMAIN_MOCKS = ["https://wolkonsky.com", "https://zhleb.ru"]

const DOMAINS_COLLECTION_ADDRESS = "EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz"

// const main = async () => {
//   DOMAIN_MOCKS.forEach(async (item) => {
//     await db.domain.upsert({
//       where: {
//         address: item,
//       },
//       update: {},
//       create: { address: item },
//     })
//   })
// }

interface SearchNFTItemsParams {
  limit: number
  offset: number
}

const searchNFTItems = async ({ limit, offset }: SearchNFTItemsParams) => {
  console.log(`Start search limit:${limit}, offset:${offset}`)
  const { data } = await axios.get(
    `https://tonapi.io/v1/nft/searchItems?collection=EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz&include_on_sale=false&limit=${limit}&offset=${offset}`
  )
  console.log(`Success search: ${data.nft_items.length} items`)
  return data.nft_items
}

const portion = 1000

const main = async () => {
  console.time("DOMAINWATCH")
  // Receive typed array of owner nfts
  let count = 0
  while (true) {
    const nftItems = await searchNFTItems({
      limit: portion,
      offset: count * portion,
    })

    if (nftItems.length) {
      for (let i = 0; i < nftItems.length; i++) {
        const nftDomainItem = nftItems[i]
        if (nftDomainItem.dns) {
          await db.nftDomain.upsert({
            where: {
              address: nftDomainItem.dns,
            },
            update: { available: false, address: nftDomainItem.dns },
            create: { available: false, address: nftDomainItem.dns },
          })
        }
      }
      count++
      continue
    }
    console.timeEnd("DOMAINWATCH")
    break
  }
}

main()
  .then(() => console.log("finish domain watcher"))
  .catch((e) => console.log("error in domain watcher", e))

export default {}
