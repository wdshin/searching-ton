import dotenv from "dotenv"
import path from "path"
import { JSDOM } from "jsdom"
import axios from "axios"
import { convert } from "html-to-text"
import { load } from "cheerio"
import textversion from "textversionjs"
import { ElasticIndexParams } from "../elastic"
import { htmlToText, SHOULD_NOT_PARSE } from "./helpers"
import { URL } from "url"
import { getTonProxy } from "../../helpers"

interface ParseUrlResult {
  elasticData: ElasticIndexParams
  subPages: Record<string, boolean>
}

const isInnerLink = (link: string) => {
  return link.startsWith("/")
}

const isInvalidLink = (link: string) => {
  return link.match(/\./) && !(link.match(/\.html/) || link.match(/\.htm/))
}

const getFaviconUrl = (dom: JSDOM, domain: string) => {
  try {
    const node = dom.window.document.querySelector("[rel=icon][type*=image]") as HTMLLinkElement
    const href = node?.href
    let url
    if (href) {
      try {
        url = new URL(href)
      } catch (e) {
        url = new URL(domain + "/" + href)
        url.pathname = url.pathname.replaceAll("//", "/")
      }
      return url.toString()
    }
  } catch (e) {
    return undefined
  }
}

class Parser {
  constructor() {}
  parseUrl = async (url: string, domain: string) => {
    try {
      const { data, headers } = await axios.get(url, {
        proxy: getTonProxy(),
      })

      const contentType = headers["content-type"].toLocaleLowerCase()

      if (!contentType.startsWith("text/html")) {
        return SHOULD_NOT_PARSE
      }

      const dom = new JSDOM(data)

      const subPagesSet = new Set()

      // собираем все ссылки и складываем их в сэт для дальнейшей обработки
      dom.window.document.querySelectorAll("a").forEach(({ href }) => {
        if (isInnerLink(href)) {
          const url = new URL("ton://a.ton" + href)
          if (!isInvalidLink(url.pathname) && [...subPagesSet].length < 50) {
            subPagesSet.add(url.pathname)
          }
        }
      })
      const subPages = [...subPagesSet].reduce(
        (acc, item) => ({ ...acc, [item]: false }),
        {}
      ) as Record<string, boolean>

      return {
        elasticData: {
          title: dom.window.document.title,
          h1: dom.window.document.querySelector("h1")?.textContent || undefined,
          bodyText: htmlToText(data),
          description:
            dom.window.document
              .querySelector("meta[name='description']")
              ?.getAttribute("content") || "",
          url,
          faviconUrl: getFaviconUrl(dom, domain),
        },
        subPages,
      }
    } catch (e) {
      console.log("Parse error ", e?.code, url)
      return SHOULD_NOT_PARSE
    }
  }
}

export default new Parser()
