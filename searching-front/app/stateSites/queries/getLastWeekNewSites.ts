import { subDays } from "date-fns"
import db from "db"

export default async function getLastWeekNewSites() {
  const lastWeekNewSites = await db.nftDomain.findMany({
    orderBy: { firstAvailableDate: "desc" },
    where: { available: true, blocked: false },
  })

  return {
    lastWeekNewSites,
  }
}
