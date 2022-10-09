import { cn } from "app/core/helpers/common"
import { useCurrentTheme } from "app/core/hooks/useCurrentTheme"
import s from "./styles.module.css"

const ThemeSwitcher = () => {
  const { theme, setTheme } = useCurrentTheme()

  const toggleTheme = () => {
    if (theme == "light") {
      setTheme("dark")
    } else {
      setTheme("light")
    }
  }
  let emoji
  if (theme == "light") {
    emoji = "🌞"
  } else {
    emoji = "🌛"
  }
  return (
    <div className={s.root}>
      <div onClick={toggleTheme} className={s.wrapper}>
        <div className={cn(s.content, { [s.light]: theme === "light" })}>{emoji}</div>
      </div>
    </div>
  )
}

export default ThemeSwitcher
