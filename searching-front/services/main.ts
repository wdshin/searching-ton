import dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.resolve(__dirname, "../.env.local") })
import domainWatcher from "./domain-watcher"
import parser from "./parser"
import influx from "./influx"

const run = async()=>{
    // console.log('Start domain watcher')
    // console.time('watcher')
    // await domainWatcher();
    // console.timeEnd('watcher')
    // influx()
    // console.log('Start parser');
    // console.time('watcher');
    await parser();
    console.timeEnd('watcher');
    
}

const second = 1000
const minute = 60 * second
const hour = 60 * minute

run()

setInterval(() => {
  console.log(new Date(), "Health check")
}, hour)

setInterval(() => {
  console.log(new Date(), "Cron parse start")
  run()
}, 3 * hour)
