import { NftDomain } from "@prisma/client"
import SearchForm from "app/core/components/SearchForm"
import TonBrilliant from "app/core/components/TonBrilliant"
import LastSitesWidget from "./LastSitesWidget"
import s from "./styles.module.css"

interface Props {
  lastWeekNewSites: NftDomain[]
}

const Main = (props:Props) => {
  
  return (
    <div className={s.root}>
      <TonBrilliant />
      <SearchForm />
      <LastSitesWidget {...props} />
    </div>
  )
}

export default Main
