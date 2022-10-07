import db from "db"

export default async function getActualSitesState() {
  const allDomainsCount = await db.nftDomain.count()
  const availableDomainsCount = await db.nftDomain.count({ where: { available: true } })

  return {
    allDomainsCount,
    availableDomainsCount,
  }
}
