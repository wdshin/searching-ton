import { fluxDuration } from "@influxdata/influxdb-client";
import { influxBucket, influxHost, influxPointName } from "./constants";
import { InfluxField, InfluxPeriod } from "./types";

export const influxQuery  = (field: InfluxField, fetchPeriod: InfluxPeriod) =>{
    let start;
    let period;

    switch(fetchPeriod){  
        case InfluxPeriod.H:
            start ='-1h'
            period = '6m'
        case InfluxPeriod.D:
            start ='-1d'
            period = '144m'
        case InfluxPeriod.W:
            start ='-1w'
            period = '1008m'
        case InfluxPeriod.M:
            start ='-1mo'
            period = '3d'
        case InfluxPeriod.Y:
            start ='-1y'
            period = '36d'
        case InfluxPeriod.tenminute:
            start ='10m'
            period = '1m'
    }

    const influxPeriod = fluxDuration(period);
    const influxStart = fluxDuration(start);
    return `from(bucket: "${influxBucket}")
    |> range(start: ${start}, stop: now())
    |> filter(fn: (r) => r["host"] == "${influxHost}")
    |> filter(fn: (r) => r["_field"] == "${field}")
    |> filter(fn: (r) => r["_measurement"] == "${influxPointName}")
    |> aggregateWindow(every: ${period}, fn: mean, createEmpty: false)
    |> yield(name: "mean")`
} 

export const processInfluxResult = (res:unknown[]) => {
    return res.map(i=>({
        value: i._value,
        time: i._time
    }))
}