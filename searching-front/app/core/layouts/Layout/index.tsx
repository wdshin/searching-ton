import Head from "next/head"
import React, { FC } from "react"
import { BlitzLayout } from "@blitzjs/next"
import s from "./styles.module.css"
import Header from "app/core/components/Header"
import { cn } from "app/core/helpers/common"
import { useCurrentTheme } from "app/core/hooks/useCurrentTheme"

const Layout: BlitzLayout<{
  title?: string
  children?: React.ReactNode
  withoutPaddings?: boolean
}> = ({ title, children, withoutPaddings }) => {
  const theme = useCurrentTheme()
  return (
    <>
      <Head>
        <title>{title || "searching-front"}</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </Head>
      <div
        id="layout"
        className={cn(s.root, {
          [theme]: theme,
        })}
      >
        <Header />
        <div className={cn(s.content, { [s.withoutPaddings]: withoutPaddings })}>{children}</div>
      </div>
    </>
  )
}

export default Layout
