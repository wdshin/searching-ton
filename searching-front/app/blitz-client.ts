// import { AuthClientPlugin } from "@blitzjs/auth"
import { setupBlitzClient } from "@blitzjs/next"
import { BlitzRpcPlugin } from "@blitzjs/rpc"

const authStub = ()=>{
  globalThis.__BLITZ_SESSION_COOKIE_PREFIX = "blitz";
  return {events:{},middleware:{}, exports: ()=>({})}
}

// export const authConfig = {
//   cookiePrefix: "searching-front-cookie-prefix",
// }
//AuthClientPlugin(authConfig)
export const { withBlitz } = setupBlitzClient({
  plugins: [authStub(),BlitzRpcPlugin({})],
})

