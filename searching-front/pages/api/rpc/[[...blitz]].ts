import { rpcHandler } from "@blitzjs/rpc"
import { api } from "app/blitz-server"

export default api(rpcHandler({ onError: (...args) =>console.log('FROM SERVER BLITZ', ...args) }))
