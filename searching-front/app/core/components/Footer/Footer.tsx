import { Routes } from "@blitzjs/next"
import TonLogo from "app/core/icons/TonLogo"
import { useRouter } from "next/router"
import { useTranslation } from "react-i18next"
import SearchForm from "../SearchForm"
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher"
import s from "./styles.module.css"
import TGLogo from "./TGLogo"

const Header = () => {
  const { route } = useRouter()

  const router = useRouter()
  const { t } = useTranslation()

  return (
    <div className={s.root}>
      <div className={s.contactsWrapper} >
        <span>{t("footer.contacts-description")}</span>
        <a target="_blank" href="https://searching_ton.t.me/"><TGLogo className={s.tgIcon}/></a>
      </div>
    </div>
  )
}

export default Header
