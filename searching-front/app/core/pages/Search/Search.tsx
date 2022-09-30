import { useQuery } from "@blitzjs/rpc"
import Pagination from "app/core/components/Pagination"
import SearchForm from "app/core/components/SearchForm"
import WebsiteCard from "app/core/components/WebsiteCard"
import getSearchResult from "app/search-requests/queries/getSearchResult"
import { useRouter } from "next/router"
import { useState } from "react"
import ReactPaginate from "react-paginate"
import s from "./styles.module.css"

const Search = () => {
  const router = useRouter()

  const [page, setPage] = useState(0)

  const [res] = useQuery(
    getSearchResult,
    { text: router.query.query as string, page },
    { suspense: false, keepPreviousData: true }
  )
  const onPageChange = (page: number) => {
    setPage(page)
  }

  const getContent = () => {
    if (res?.hits.length) {
      return (
        <div className={s.content}>
          <div className={s.content}>
            {Object.values(res.hits).map((i) => (
              <WebsiteCard {...i} />
            ))}
          </div>
          <div className={s.pagination}>
            <Pagination
              onPageChange={onPageChange}
              currentPage={page}
              pagesCount={res.pagesCount}
            />
          </div>
        </div>
      )
    } else if (res && !res.hits.length) {
      return "not found"
    }
    return "loading"
  }
  return <div className={s.root}>{getContent()}</div>
}

export default Search
