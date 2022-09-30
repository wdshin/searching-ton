import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
import Elastic from "services/modules/elastic"
import { SEARCH_PER_PAGE } from "services/commonConstants"
import upsertSearchRequest from "../mutations/upsertSearchRequest"

const GetSearchRequest = z.object({
  // This accepts type of undefined, but is required at runtime
  text: z.string(),
  page: z.number(),
})

const bodyToDescription = (text: string, search) => {
  const reg = new RegExp(`(${search}.{100})`)
  const justText = new RegExp(`(.{100})`)
  return reg.exec(text)?.[0] || justText.exec(text)?.[0]
}

const processResult = ({ bodyText, ...res }: Object, search: string) => {
  return {
    ...res,
    description: res.description || bodyToDescription(bodyText, search),
  }
}

export default resolver.pipe(resolver.zod(GetSearchRequest), async ({ text, page }, c) => {
  upsertSearchRequest({ text }, c).catch(console.log)

  const result = await Elastic.search({ text, page })

  return {
    hits: result.hits.map((i) => processResult(i._source, text)),
    pagesCount: Math.ceil(result.total / SEARCH_PER_PAGE),
  }
})
