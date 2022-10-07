import influxdb from "services/modules/influxdb"
import { InfluxPeriod } from "services/modules/influxdb/types"

export default async function getActualSitesState(period: InfluxPeriod = InfluxPeriod.D) {
  return await influxdb.getHistoryOfState(period)
}
