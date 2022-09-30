import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const CreateSearchRequest = z.object({
  text: z.string(),
})

export default resolver.pipe(
  resolver.zod(CreateSearchRequest),
  async ({ text }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    // const searchRequest = await db.searchRequest.create({ data: input });
    const searchRequest = await db.searchRequest.upsert({
      where: {
        text,
      },
      update: { count: { increment: 1 } },
      create: { text },
    })

    return searchRequest
  }
)
