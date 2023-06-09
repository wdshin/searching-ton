import { Routes } from "@blitzjs/next"
import { count } from "app/core/helpers/metrika"
import TonLogo from "app/core/icons/TonLogo"
import { useRouter } from "next/router"
import { useTranslation } from "react-i18next"
import SearchForm from "../SearchForm"
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher"
import s from "./styles.module.css"
import TGLogo from "./TGLogo"


interface FooterLinkProps {
  href: string;
  keyLink: string;
  isTg?: boolean;
  
}

const FooterLink = ({href,keyLink,isTg}:FooterLinkProps) => {
  const { t } = useTranslation()
  const onClick =() => {
    count(keyLink)
  }
  return (
    <a onClick={onClick} target="_blank" href={href} className={s.footerLinkRoot}>
      {isTg && <TGLogo className={s.tgIcon}/>} {t(keyLink)}
    </a>
  )
}

const Footer = () => {
  const { t } = useTranslation()

  return (
    <div className={s.root}>
      <div className={s.contactsWrapper}>
      <FooterLink href="https://mattiy.t.me/" keyLink="footer.linkAnnouncments" />
      <FooterLink href="https://mattiy.t.me/" keyLink="footer.linkFeedback" />
      </div>
    </div>
  )
}

export default Footer
