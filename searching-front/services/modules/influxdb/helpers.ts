import { fluxDuration } from "@influxdata/influxdb-client"
import { influxBucket, influxHost, influxPointName } from "./constants"
import { InfluxField, InfluxPeriod } from "./types"

export const influxQuery = (field: InfluxField, fetchPeriod: InfluxPeriod) => {
  let start
  let period

  switch (fetchPeriod) {
    case InfluxPeriod.H:
      start = "-1h"
      period = "6m"
      break
    case InfluxPeriod.D:
      start = "-1d"
      period = "144m"
      break
    // case InfluxPeriod.W:
    //   start = "-1w"
    //   period = "1008m"
    //   break
    // case InfluxPeriod.M:
    //   start = "-1mo"
    //   period = "3d"
    //   break
    // case InfluxPeriod.Y:
    //   start = "-1y"
    //   period = "36d"
    //   break
    // case InfluxPeriod.tenminute:
    //     start ='-10m'
    //     period = '1m'
  }

  const query = `from(bucket: "${influxBucket}")
    |> range(start: ${start}, stop: now())
    |> filter(fn: (r) => r["host"] == "${influxHost}")
    |> filter(fn: (r) => r["_field"] == "${field}")
    |> filter(fn: (r) => r["_measurement"] == "${influxPointName}")
    |> aggregateWindow(every: ${period}, fn: last, createEmpty: false)
    |> yield(name: "last")`

  return query
}

export const processInfluxResult = (res: unknown[]) => {
  return res.map((i) => ({
    value: i._value,
    time: i._time,
  }))
}
