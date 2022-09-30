import SearchForm from "app/core/components/SearchForm"
import TonBrilliant from "app/core/components/TonBrilliant"
import s from "./styles.module.css"

const Main = () => {
  return (
    <div className={s.root}>
      <TonBrilliant />
      <SearchForm />
    </div>
  )
}

export default Main
