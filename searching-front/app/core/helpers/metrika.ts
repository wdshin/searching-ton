import cookies from "js-cookie"

export const count = (event: string) => {
  const isDev = cookies.get("dev")
  console.log(event)
  if (isDev) {
    return
  }
  try {
    yaCounter90644479.reachGoal(event)
  } catch (e) {}
  gtag("event", event)
}
