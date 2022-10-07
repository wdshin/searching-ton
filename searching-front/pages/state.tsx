import { Suspense } from "react"

import Layout from "app/core/layouts/Layout"
import getActualSitesState from "app/stateSites/queries/getActualSitesState"
import getHistoryOfSitesState from "app/stateSites/queries/getHistoryOfSitesState"
import { BlitzPage } from "@blitzjs/next"
import State from "app/core/pages/State"
import { gSP } from "app/blitz-server"

import { ErrorBoundary } from "@blitzjs/next"

import {
  ServerSidePropsContext,
} from "app/core/contextProviders/serverSidePropsProvider"
import { StatePageProps } from "app/core/pages/State/State"
import { StaticPageProps } from "app/core/commonTypes"

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

const StatePage: BlitzPage<StatePageProps> = (props) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // reset the state of your app so the error doesn't happen again
      }}
    >
      <ServerSidePropsContext.Provider value={props}>
        <Layout title="State of TON Sites" withoutPaddings>
          <Suspense fallback="Loading...">
            <State {...props} />
          </Suspense>
        </Layout>
      </ServerSidePropsContext.Provider>
    </ErrorBoundary>
  )
}

export const getServerSideProps = async ({ params, ctx }): StaticPageProps<StatePageProps> => {
  const actualState = await getActualSitesState();
  const historyOfState = await getHistoryOfSitesState();
  return {
    props: {
      actualState,
      historyOfState
    },
  }
}

export default StatePage
