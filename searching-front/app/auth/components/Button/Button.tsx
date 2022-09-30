import { cn } from "app/core/helpers/common"
import { ReactNode } from "react"
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion"
import s from "./styles.module.css"

interface Props {
  children: ReactNode
  theme: "primary"
  className?: string
  onClick: () => void
}
const Button = ({
  children,
  theme,
  className,
  onClick,
  ...motionpProps
}: Props & HTMLMotionProps<"button">) => {
  return (
    <motion.button
      onClick={onClick}
      className={cn(s.root, className, `theme-${theme}`)}
      {...motionpProps}
    >
      {children}
    </motion.button>
  )
}

export default Button
