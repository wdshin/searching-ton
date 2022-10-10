import { Client } from "@elastic/elasticsearch"
import { SEARCH_PER_PAGE } from "../../commonConstants"
import { detectLang, Languages } from "../../helpers/detectLang"

const INDEX_NAME = "common-website-test"
const RU_INDEX_NAME = "ru-website-test"

export interface ElasticIndexParams {
  url: string
  title: string
  h1?: string
  bodyText: string
  description?: string
  faviconUrl?: string
}
export interface ElasticSearchParams {
  text: string
  page?: number
}

const getIndexNameByLang = (lang: Languages) => {
  switch (lang) {
    case Languages.EN:
      return INDEX_NAME
    case Languages.RU:
      return RU_INDEX_NAME
  }
}

const getAnalyzerByLang = (lang: Languages) => {
  switch (lang) {
    case Languages.EN:
      return undefined
    case Languages.RU:
      return "russian"
  }
}

const getIndexNameByText = (text: string) => {
  const lang = detectLang(text)
  return getIndexNameByLang(lang)
}

class Elastic {
  private client: Client
  constructor() {
    this.client = new Client({
      node: process.env.ELASTIC_URL || "http://localhost:9200",
    })
  }

  public updateMappings = async () => {
    await this.client.indices.putMapping({
      index: INDEX_NAME,
      properties: {
        bodyText: {
          type: "text",
          analyzer: "russian",
        },
      },
    })
  }

  public createIndex = async (lang: Languages) => {
    const indexName = getIndexNameByLang(lang)
    const analyzer = getAnalyzerByLang(lang)
    await this.client.indices.create({
      index: indexName,
      mappings: {
        properties: {
          bodyText: {
            type: "text",
            analyzer,
          },
          title: {
            type: "text",
            analyzer,
          },
          h1: {
            type: "text",
            analyzer,
          },
          description: {
            type: "text",
            analyzer,
          },
        },
      },
    })
  }

  public initElastic = async () => {
    const promises = [Languages.EN, Languages.RU].map(async (lang) => {
      const indexName = getIndexNameByLang(lang)
      const alreadyExist = await this.client.indices.exists({ index: indexName })
      if (!alreadyExist) {
       return await this.createIndex(lang)
      }
      return
    })
    return await Promise.all(promises)
  }

  public index = async (params: ElasticIndexParams) => {
    const indexName = getIndexNameByText(params.title + params.bodyText)
    console.log('index',params)
    await this.client.index({
      index: indexName,
      id: params.url,
      document: {
        url: params.url,
        title: params.title,
        h1: params.h1,
        bodyText: params.bodyText,
        description: params.description,
        faviconUrl: params.faviconUrl,
      },
    })
  }

  public search = async ({ text, page = 0 }: ElasticSearchParams) => {
    const indexName = getIndexNameByText(text)
    const from = page * SEARCH_PER_PAGE
    const result = await this.client.search({
      index: indexName,
      size: SEARCH_PER_PAGE,
      from,
      query: {
        multi_match: {
          query: text,
          fields: ["title^4", "description^3", "h1^2", "bodyText"],
        },
      },
    })

    return {
      hits: result.hits.hits,
      // @ts-ignore
      total: result.hits.total?.value,
    }
  }
}

export default new Elastic()
