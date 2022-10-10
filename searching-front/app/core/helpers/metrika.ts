import cookies from "js-cookie"

export const count = (event: string) => {
  const isDev = cookies.get("dev")
  if (isDev) {
    return
  }
  yaCounter90644479.reachGoal(event)
  gtag("event", event)
}
