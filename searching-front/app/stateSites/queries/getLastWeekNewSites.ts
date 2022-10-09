import { subDays } from "date-fns"
import db from "db"

export default async function getLastWeekNewSites() {
  const weekAgo = subDays(new Date(), 7)

  const lastWeekNewSites = await db.nftDomain.findMany({
    orderBy: { firstAvailableDate: "desc" },
    take: 10,
    where: { available: true, AND: { firstAvailableDate: { gt: weekAgo } } },
  })
  console.log(lastWeekNewSites)
  return {
    lastWeekNewSites,
  }
}
