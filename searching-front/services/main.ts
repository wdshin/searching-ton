import domainWatcher from './domain-watcher'
import parser from './parser'


const run = async()=>{
    console.log('Start domain watcher')
    await domainWatcher();
    console.log('Start parser')
    await parser();
}

const second = 1000;
const minute= 60 * second;
const hour = 60 * minute; 

run();

setInterval(()=>{
    run()
},3 * hour)