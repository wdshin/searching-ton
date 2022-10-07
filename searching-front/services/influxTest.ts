import path from "path"
import dotenv from "dotenv"
dotenv.config({ path: path.resolve(__dirname, "../.env.local") })

import { Ctx } from "blitz"
import db from "db"


import { InfluxPeriod } from "./modules/influxdb/types"
import influxdb from "./modules/influxdb"

export default async function run(period:InfluxPeriod = InfluxPeriod.W) {
    const res = await influxdb.getHistoryOfState(period);
    console.log(res)
  
}
run()