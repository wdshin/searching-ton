import { Doughnut, Line } from "react-chartjs-2"
import { format } from "date-fns"
import { useQuery } from "@blitzjs/rpc"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ChartData } from "chart.js/auto"

import getActualSitesState from "app/stateSites/queries/getActualSitesState"
import getHistoryOfSitesState from "app/stateSites/queries/getHistoryOfSitesState"
import { InfluxPeriod } from "services/modules/influxdb/types"
import { cn } from "app/core/helpers/common"

import s from "./styles.module.css"

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
}

const availableSitesColor = "#08c"
const allSitesColor = "hsl(200 15% 81% / 1)"

const getDohnutData = (data: number[]) => ({
  labels: ["Available", "All"],
  datasets: [
    {
      data: data,
      backgroundColor: [availableSitesColor, allSitesColor],
      borderColor: [availableSitesColor, "rgba(0,0,0,0)"],
      borderWidth: 1,
    },
  ],
})

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

const State = ({ actualState, historyOfState: historyOfStatePreloaded }: StatePageProps) => {
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
      <div className={s.title}>{t("state.title")}</div>
      <div className={s.doughnutAvailable}>
        <Doughnut
          data={getDohnutData([actualState.availableDomainsCount, actualState.allDomainsCount])}
        />
      </div>
      <div className={s.actualStateWrapper}>
        <span className={s.availableCount}>{actualState.availableDomainsCount}</span>{" "}
        {t("state.siteOutOf")} <span className={s.allCount}>{actualState.allDomainsCount}</span>
        <span className={s.areNowAvailable}>{t("state.areNowAvailable")}</span>
      </div>
      {historyOfState && (
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
          </div>
          <HistoryItem
            title="All sites count"
            data={getGraphData(historyOfState.all, "All sites count", availableSitesColor)}
          />
          <HistoryItem
            title="Available sites count"
            data={getGraphData(historyOfState.available, "Available sites count", allSitesColor)}
          />
        </div>
      )}
    </div>
  )
}

export default State
