import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import Layout from "app/core/layouts/Layout"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"
import logo from "public/logo.png"
import { useMutation } from "@blitzjs/rpc"
import { Routes, BlitzPage } from "@blitzjs/next"
import Main from "app/core/pages/Main"
// import MainSearch from "app/core/pages/MainSearch/old"

import { ErrorBoundary } from "@blitzjs/next"

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}
import {
  serverSideProps,
  ServerSidePropsContext,
} from "app/core/contextProviders/serverSidePropsProvider"
import { gSSP } from "app/blitz-server"
import ContextProviders from "app/core/components/ContextProviders"
import getLastWeekNewSites from "app/stateSites/queries/getLastWeekNewSites"
import { NftDomain } from "@prisma/client"

interface Props {
  lastWeekNewSites: NftDomain[]
  cookies: Record<string,string>
}

const Home: BlitzPage<Props> = (props) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // reset the state of your app so the error doesn't happen again
      }}
    >
      <ContextProviders contextParamsServer={props}>
        <Layout title="Searching" withoutPaddings>
          <Suspense fallback="Loading...">
            <Main lastWeekNewSites={props.lastWeekNewSites}/>
          </Suspense>
        </Layout>
      </ContextProviders>
    </ErrorBoundary>
  )
}

export const getServerSideProps = gSSP(
  serverSideProps(async () => {
    return {
      ...(await getLastWeekNewSites()),
    }
  })
)

export default Home
