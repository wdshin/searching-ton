import { NotFoundError } from "blitz";
import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const GetSearchRequest = z.object({
  // This accepts type of undefined, but is required at runtime
  text: z.string().optional()
});

export default resolver.pipe(
  resolver.zod(GetSearchRequest),
  async ({ text }) => {
    if(!text){
      return []
    }
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const searchRequest = await db.searchRequest.findMany({ where:{text:{startsWith:text}},take:5,orderBy:[{count:'desc'}] })

    // if (!searchRequest) throw new NotFoundError();

    return searchRequest;
  }
);
