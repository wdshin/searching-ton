import { AuthClientPlugin } from "@blitzjs/auth"
import { setupBlitzClient } from "@blitzjs/next"
import { BlitzRpcPlugin } from "@blitzjs/rpc"

// export const authConfig = {
//   cookiePrefix: "searching-front-cookie-prefix",
// }
//AuthClientPlugin(authConfig)
export const { withBlitz } = setupBlitzClient({
  plugins: [BlitzRpcPlugin({})],
})
