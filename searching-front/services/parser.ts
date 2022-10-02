import db from "../db/index"
import Elastic from "./modules/elastic"
import Parser from "./modules/parser"
import { SHOULD_NOT_PARSE } from "./modules/parser/helpers"
import { Domain } from "domain"

type SubPages = Record<string, boolean>

const findFirstNotIndexed = (subpages: SubPages = {}) => {
  return Object.entries(subpages).find(([url, isIndexed]) => !isIndexed)?.[0]
}

const indexWebsite = async (domain: string, path: string, subpages: SubPages = {}) => {
  console.log('Start indexWebsite ', domain)
  if (!subpages[path]) {
    const url = domain + path;
    const parseInfo = await Parser.parseUrl(url)
    subpages[path] = true
    let pages = {}
    if (parseInfo !== SHOULD_NOT_PARSE) {
      await Elastic.index(parseInfo.elasticData)
      pages = {
        ...parseInfo.subPages,
        ...subpages,
      }
    } else {
      pages = subpages
    }
    console.log(pages)
    const firstNotIndexed = findFirstNotIndexed(pages)
    if (firstNotIndexed) {
      return await indexWebsite(domain, firstNotIndexed, pages)
    }
  } else {
    const firstNotIndexed = findFirstNotIndexed(subpages)
    if (firstNotIndexed) {
      return await indexWebsite(domain, firstNotIndexed, subpages)
    }
  }
}


const main = async () => {
  await Elastic.initElastic()
  console.log('Success InitElastic')
  const domains = await db.nftDomain.findMany()
  console.log('Find domains', domains)
  if (domains) {
    for (const domain of domains) {
      console.log('Update ', domain)
      await db.nftDomain.update({
        where: { address: domain.address },
        data: { lastParse: new Date() },
      })
      console.log('Start index domain: ',domain.address)
      await indexWebsite(domain.address, "/")
    }
  }
  console.log('Finish parse domains')
}


export default main
