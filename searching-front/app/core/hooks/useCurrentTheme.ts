import { useContext } from "react"
import { ServerSidePropsContext } from "../contextProviders/serverSidePropsProvider"

export const useCurrentTheme = () => {
  const { theme, setTheme } = useContext(ServerSidePropsContext)
  return { theme, setTheme }
}


