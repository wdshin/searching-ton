import influxdb from "./modules/influxdb"

import db from "../db/index"

const main = async () => {
  const allDomainsCount = await db.nftDomain.count()
  const availableDomainsCount = await db.nftDomain.count({ where: { available: true } })
  influxdb.writeSitesCount({
    all: allDomainsCount,
    available: availableDomainsCount,
  })
}

export default main
