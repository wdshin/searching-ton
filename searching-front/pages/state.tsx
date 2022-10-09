import { Suspense } from "react"

import Layout from "app/core/layouts/Layout"
import getActualSitesState from "app/stateSites/queries/getActualSitesState"
import getHistoryOfSitesState from "app/stateSites/queries/getHistoryOfSitesState"
import { BlitzPage } from "@blitzjs/next"
import State from "app/core/pages/State"
import { gSSP } from "app/blitz-server"
import {
  serverSideProps,
  ServerSidePropsContext,
} from "app/core/contextProviders/serverSidePropsProvider"

import { ErrorBoundary } from "@blitzjs/next"

import { StatePageProps } from "app/core/pages/State/State"
import { StaticPageProps } from "app/core/commonTypes"
import ContextProviders from "app/core/components/ContextProviders"
import getLastWeekNewSites from "app/stateSites/queries/getLastWeekNewSites"

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

const StatePage: BlitzPage = (props) => {
  
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // reset the state of your app so the error doesn't happen again
      }}
    >
      <ContextProviders contextParamsServer={props}>
        <Layout title="State of TON Sites" withoutPaddings>
          <Suspense fallback="Loading....">
            <State {...props} />
          </Suspense>
        </Layout>
      </ContextProviders>
    </ErrorBoundary>
  )
}

export const getServerSideProps = gSSP(
  serverSideProps(async (): Promise<StatePageProps> => {
    const actualState = await getActualSitesState()
    const historyOfState = await getHistoryOfSitesState()
    return {
      actualState,
      historyOfState,
      ...(await getLastWeekNewSites()),
    }
  })
)

export default StatePage
