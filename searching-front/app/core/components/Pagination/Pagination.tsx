import { cn } from "app/core/helpers/common"
import ReactPaginate from "react-paginate"
import s from "./styles.module.css"

interface Props {
  currentPage: number
  pagesCount: number
  onPageChange: (page: number) => void
}

const Pagination = ({ currentPage, pagesCount, onPageChange }: Props) => {
  return (
    <div className={s.pagination}>
      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        onPageChange={(params) => {
          window.scrollTo(0,0);
          onPageChange(params.selected);
        }}
        pageRangeDisplayed={3}
        pageCount={pagesCount}
        previousLabel="<"
        forcePage={currentPage}
        // className={className}
        // pageLabelBuilder={s.pageLab}
        containerClassName={s.container}
        pageClassName={s.page}
        pageLinkClassName={s.pageLink}
        activeClassName={s.active}
        activeLinkClassName={s.activeLink}
        previousClassName={s.page}
        nextClassName={s.page}
        previousLinkClassName={s.pageLink}
        nextLinkClassName={s.pageLink}
        disabledClassName={s.disabled}
        disabledLinkClassName={s.disabledLink}
        breakClassName={cn(s.break, s.page)}
        breakLinkClassName={s.pageLink}
      />
    </div>
  )
}

export default Pagination
