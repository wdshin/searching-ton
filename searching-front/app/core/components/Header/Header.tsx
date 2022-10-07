import { Routes } from "@blitzjs/next"
import TonLogo from "app/core/icons/TonLogo"
import { useRouter } from "next/router"
import SearchForm from "../SearchForm"
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher"
import s from "./styles.module.css"

const Header = () => {
  const { route } = useRouter()
  const shouldShowSearchForm = route !== Routes.Home().pathname
  const router = useRouter()
  const toMain = async () => {
    await router.push("/")
  }

  return (
    <div className={s.root}>
      <div onClick={toMain} className={s.logoWrapper}>
        <TonLogo /> <span>TON SEARCHING</span>
      </div>
      {shouldShowSearchForm && <SearchForm />}
      {/* <ThemeSwitcher /> */}
    </div>
  )
}

export default Header
