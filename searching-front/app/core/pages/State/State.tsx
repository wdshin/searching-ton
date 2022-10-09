import { Doughnut, Line } from "react-chartjs-2"
import { format } from "date-fns"
import { useQuery } from "@blitzjs/rpc"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ChartData } from "chart.js/auto"
import "chart.js/auto"

import getActualSitesState from "app/stateSites/queries/getActualSitesState"
import getHistoryOfSitesState from "app/stateSites/queries/getHistoryOfSitesState"
import { InfluxPeriod } from "services/modules/influxdb/types"
import { cn, getDomainFromUrl } from "app/core/helpers/common"

import s from "./styles.module.css"
import { NftDomain } from "@prisma/client"
import Button from "app/auth/components/Button"
import Link from "app/core/components/Link"
import { count } from "app/core/helpers/metrika"

interface HistoryOfStateItem {
  value: number
  time: string
}

interface HistoryOfState {
  all: HistoryOfStateItem[]
  available: HistoryOfStateItem[]
}

export interface StatePageProps {
  actualState: Awaited<ReturnType<typeof getActualSitesState>>
  historyOfState: HistoryOfState
  lastWeekNewSites: NftDomain[]
}

const availableSitesColor = "#08c"
const allSitesColor = "hsl(200 15% 81% / 1)"

const liteOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      intersect: false,
    },
  },

  scales: {
    x: {
      display: false,
    },
  },
}
export const getGraphData = (
  data: HistoryOfStateItem[],
  label: string,
  color: string
): ChartData<"line", number[], string> => ({
  labels: data.map((item) => format(new Date(item.time), "dd.MM.yy hh:mm")),
  datasets: [
    {
      label,
      data: data.map((item) => item.value),
      backgroundColor: color,
      borderColor: color,
      tension: 0.3,
    },
  ],
})

interface HistoryItemProps {
  data: ChartData<"line", number[], string>
  title: string
}

const HistoryItem = ({ data, title }: HistoryItemProps) => {
  return (
    <div className={s.historyStateItem}>
      <div>{title}</div>
      <Line options={liteOptions} data={data} />
    </div>
  )
}

const State = ({
  actualState,
  historyOfState: historyOfStatePreloaded,
  lastWeekNewSites,
}: StatePageProps) => {
  const [historyPeriod, setHistoryPeriod] = useState(InfluxPeriod.D)
  const { t } = useTranslation()
  const [historyOfState] = useQuery(getHistoryOfSitesState, historyPeriod, {
    suspense: false,
    keepPreviousData: true,
    initialData: historyOfStatePreloaded,
  })
  console.log(historyPeriod, historyOfState)
  return (
    <div className={s.root}>
      <div className={s.actualStateWrapper}>
        <div className={s.counterWrapper}>
          <span className={s.availableCount}>{actualState.availableDomainsCount}</span>
          <span className={s.allCount}>/ {actualState.allDomainsCount}</span>
          <div className={s.counterFooter}>
            <div className={s.areNowAvailable}>{t("state.areNowAvailable")}</div>
            <div className={s.counterDate}>9 september</div>
          </div>
        </div>
      </div>
      <div className={s.newestTitle}>
        10 newest <span className={s.newestTitleTon}>TON</span> sites
      </div>
      <div className={s.newestListWrapper}>
        {lastWeekNewSites.map((i) => (
          <Link
            target="_blank"
            theme="clear"
            href={i.address + "?from=Searching.ton"}
            wide
            className={s.newestListItem}
            onClick={()=>count('from_state_page_to_site')}
          >
            {getDomainFromUrl(i.address)}
            <Button onClick={console.log} className={s.siteButton} theme="primary">
              .ton
            </Button>
          </Link>
        ))}
      </div>

      {/* {historyOfState && (
        <div className={s.historyStateWrapper}>
          <div className={s.historyStatePeriodsWrapper}>
            {Object.values(InfluxPeriod).map((i) => (
              <button
                onClick={() => setHistoryPeriod(i)}
                className={cn(s.historyStatePeriodsItem, { [s.active]: historyPeriod === i })}
              >
                {i}
              </button>
            ))}
          </div> */}
      {/* <HistoryItem
            title="Available sites count"
            data={getGraphData(
              historyOfState.available,
              "Available sites count",
              availableSitesColor
            )}
          />
          <HistoryItem
            title="All sites count"
            data={getGraphData(historyOfState.all, "All sites count", allSitesColor)}
          /> */}
      {/* </div> */}
      {/* )} */}
    </div>
  )
}

export default State
