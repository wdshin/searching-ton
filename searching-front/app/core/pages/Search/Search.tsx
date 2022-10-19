import { useQuery } from "@blitzjs/rpc"
import DomainCard from "app/core/components/DomainCard"
import Pagination from "app/core/components/Pagination"
import SearchForm from "app/core/components/SearchForm"
import WebsiteCard from "app/core/components/WebsiteCard"
import getSearchResult from "app/search-requests/queries/getSearchResult"
import { useRouter } from "next/router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import ReactPaginate from "react-paginate"
import s from "./styles.module.css"

const Search = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const [page, setPage] = useState(0)
  const text = router.query.query as string
  const [res] = useQuery(
    getSearchResult,
    { text, page },
    { suspense: false, keepPreviousData: true }
  )
  const onPageChange = (page: number) => {
    setPage(page)
  }

  const getContent = () => {
    if (res?.hits.length || res?.domain) {
      return (
        <div className={s.content}>
          <div className={s.content}>
            {res?.domain && <DomainCard {...res.domain}/>}
            {Object.values(res.hits).map((i) => (
              <WebsiteCard {...i} />
            ))}
          </div>
          <div className={s.pagination}>
            {res.pagesCount > 1 && (
              <Pagination
                onPageChange={onPageChange}
                currentPage={page}
                pagesCount={res.pagesCount}
              />
            )}
          </div>
        </div>
      )
    } else if (res && !res.hits.length) {
      return (
        <div>
          {t("searchPage.notFound")}
          <b>«{text}»</b>
        </div>
      )
    }
    return "loading"
  }
  return <div className={s.root}>{getContent()}</div>
}

export default Search
