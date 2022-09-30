import { useContext } from "react"
import { ServerSidePropsContext } from "../contextProviders/serverSidePropsProvider"
import jsCookies from "js-cookie"

const COOKIE_NAME = "theme"

export const useCurrentTheme = () => {
  const { cookies } = useContext(ServerSidePropsContext)
  return jsCookies.get(COOKIE_NAME) || cookies[COOKIE_NAME] || "light"
}
