
import { format } from "date-fns"



import { cn, getDomainFromUrl, getObserverUrlByAddress } from "app/core/helpers/common"

import s from "./styles.module.css"
import { NftDomain } from "@prisma/client"
import Button from "app/auth/components/Button"
import Link from "app/core/components/Link"
import { count } from "app/core/helpers/metrika"
import TonLogoWithoutBg from "app/core/icons/TonLogoWithoutBg"


const DomainCard = (props: NftDomain) => {
  return (
    <div className={s.newestListItem}>
      <Link
        className={s.newestListItemLeft}
        target="_blank"
        theme="clear"
        href={props.address + "?from=Searching.ton"}
        onClick={() => count("from_state_page_to_site")}
        wide
        title="Open tonsite"
      >
        <div className={s.newestListItemLeftContent}>
          {getDomainFromUrl(props.address)}
          <Button className={s.siteButton} theme="primary">
            .ton
          </Button>
        </div>

        <div className={s.newestListItemLeftDate}>
          {props.firstAvailableDate && format(new Date(props.firstAvailableDate), "d MMMM").toLowerCase()}
        </div>
      </Link>

      {props.walletAddress && props.tonBalance && (
        <Link
          className={s.newestListItemRight}
          target="_blank"
          theme="clear"
          href={getObserverUrlByAddress(props.walletAddress)}
          onClick={() => count("from_state_page_to_tonscan")}
          title="Open wallet in tonscan"
          wide
        >
          ~
          {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })
            .format(+props.tonBalance)
            .replace("$", "")
            .replaceAll(",", " ")}
          <div className={s.tonScanIcon}>
            <TonLogoWithoutBg />
          </div>
        </Link>
      )}
    </div>
  )
}

export default DomainCard
