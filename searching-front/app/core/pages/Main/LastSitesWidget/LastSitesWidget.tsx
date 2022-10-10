import { Routes } from "@blitzjs/next"
import { NftDomain } from "@prisma/client"
import Button from "app/auth/components/Button"
import Link from "app/core/components/Link"
import { getDomainFromUrl } from "app/core/helpers/common"
import { count } from "app/core/helpers/metrika"
import { motion } from "framer-motion"
import s from "./styles.module.css"

interface Props {
  lastWeekNewSites: NftDomain[]
}

const LastSitesWidget = (props: Props) => {
  
  return (
    <div className={s.root}>
      <div className={s.heading}>
        New sites{" "}
        <Link onClick={()=>count('from_main_new_sites_widget_to_state_page')} className={s.link} theme="primary" href={Routes.StatePage()}>
          See all
        </Link>
      </div>
      <div className={s.sitesWrapperShadows}>
        <div className={s.sitesWrapper}>
          {props.lastWeekNewSites.map((i) => (
            <div className={s.sitesItem}>
              <Link
                className={s.siteAddress}
                target="_blank"
                theme="clear"
                href={i.address + "?from=Searching.ton"}
                onClick={()=>count('from_main_new_sites_widget_to_site')}
              >
                {getDomainFromUrl(i.address)}
                <Button className={s.siteButton} theme="primary">
                  .ton
                </Button>
              </Link>
            </div>
          ))}
        </div>
        <Button className={s.button} theme="primary">
          .ton
        </Button>
      </div>
    </div>
  )
}

export default LastSitesWidget
