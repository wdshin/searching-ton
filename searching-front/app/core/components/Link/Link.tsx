import { cn } from "app/core/helpers/common"
import { ReactNode } from "react"
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion"
import s from "./styles.module.css"

import NextLink from "next/link"
import { Routes } from "@blitzjs/next"

interface Props {
  children: ReactNode
  theme: "primary" | "clear"
  className?: string
  onClick?: () => void
  href: string | ReturnType<typeof Routes.Home>
  wide?: boolean
}

const Link = ({
  children,
  theme,
  className,
  onClick,
  href,
  wide,
  ...linkProps
}: Props & React.ComponentProps<typeof NextLink>) => {
  return (
    <div className={cn(s.root, className, `theme-${theme}`)}>
      <NextLink target="_blank" href={href} >
        <a {...linkProps} onClick={onClick} className={cn({ [s.wide]: wide })}>
          {children}
        </a>
      </NextLink>
    </div>
  )
}

export default Link
