import {
  ServerSidePropsContext,
  ContextParamsServer,
} from "app/core/contextProviders/serverSidePropsProvider"
import { ReactNode, useState } from "react"
import jsCookies from "js-cookie"

interface Props {
  children: ReactNode
  contextParamsServer: ContextParamsServer
}

type Theme = "light" | "dark"
const THEME_COOKIE_NAME = "theme"

const ContextProviders = ({ children, contextParamsServer: { cookies } }: Props) => {
  const [theme, setThemeState] = useState<Theme>((cookies[THEME_COOKIE_NAME] as Theme) || 'dark')
  const setTheme = (theme: Theme) => {
    jsCookies.set(THEME_COOKIE_NAME, theme)
    setThemeState(theme)
  }

  const context = {
    theme,
    setTheme,
  }

  return (
    <ServerSidePropsContext.Provider value={context}>{children}</ServerSidePropsContext.Provider>
  )
}

export default ContextProviders
