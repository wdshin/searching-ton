import dotenv from "dotenv"
import path from "path"
import { JSDOM } from "jsdom"
import axios from "axios"
import tinyld from "tinyld"
import languagedetect from "languagedetect"

dotenv.config({ path: path.resolve(__dirname, "../.env.local") })

import db from "../db/index"
import Elastic from "./modules/elastic"
import Parser from "./modules/parser"
import { SHOULD_NOT_PARSE } from "./modules/parser/helpers"

type SubPages = Record<string, boolean>

const findFirstNotIndexed = (subpages: SubPages = {}) => {
  return Object.entries(subpages).find(([url, isIndexed]) => !isIndexed)?.[0]
}

const indexWebsite = async (domain: string, url: string, subpages: SubPages = {}) => {
  if (!subpages[url]) {
    const urlObj = new URL(domain + url)
    const parseInfo = await Parser.parseUrl(urlObj.toString())
    subpages[url] = true
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
  // await Elastic.initElastic()
  // await Elastic.createIndex()
  const domains = await db.domain.findMany()

  if (domains) {
    console.time("index")
    for (const domain of domains) {
      console.time("index" + domain.address)
      await db.domain.update({
        where: { address: domain.address },
        data: { lastParse: new Date() },
      })
      await indexWebsite(domain.address, "/")
      console.timeEnd("index" + domain.address)
    }
    console.timeEnd("index")
  }
}

main()
  .then(() => console.log("finish parser"))
  .catch((e) => console.log("error in parserr", e))

export default {}
