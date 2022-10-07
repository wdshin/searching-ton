import { fluxDuration, InfluxDB } from "@influxdata/influxdb-client"
import { Point } from "@influxdata/influxdb-client"
import { influxBucket, influxHost, influxOrg, influxPointName, influxToken } from "./constants"
import { influxQuery, processInfluxResult } from "./helpers"
import { InfluxField, InfluxPeriod } from "./types"

interface WriteSitesCounteParams {
  all: number
  available: number
}

interface QueryParams {
  field: InfluxField
  period: InfluxPeriod
}

class InfluxDb {
  private client: InfluxDB
  constructor() {
    this.client = new InfluxDB({ url: process.env.INFLUX_URL as string, token: influxToken })
  }
  getWriteApi() {
    const writeApi = this.client.getWriteApi(influxOrg, influxBucket)
    writeApi.useDefaultTags({ host: influxHost })
    return writeApi
  }
  writeSitesCount({ all, available }: WriteSitesCounteParams) {
    const writeApi = this.getWriteApi()
    const pointAll = new Point(influxPointName).intField(InfluxField.ALL_SITES, all)
    const pointAvailable = new Point(influxPointName).intField(
      InfluxField.AVAILABLE_SITES,
      available
    )
    writeApi.writePoint(pointAll)
    writeApi.writePoint(pointAvailable)
    writeApi.close()
  }
  async query({ field, period }: QueryParams) {
    const queryApi = this.client.getQueryApi(influxOrg)

    const query = influxQuery(field, period)
    const result = await queryApi.collectRows(query)
    return processInfluxResult(result);
  }

  async getHistoryOfState(period: InfluxPeriod) {
    const all = await this.query({
      field: InfluxField.ALL_SITES,
      period,
    })

    const available = await this.query({
      field: InfluxField.AVAILABLE_SITES,
      period,
    })

    return {
      all,
      available,
    }
  }
}

export default new InfluxDb()
