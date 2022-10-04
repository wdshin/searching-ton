import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import Layout from "app/core/layouts/Layout"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"
import logo from "public/logo.png"
import { useMutation } from "@blitzjs/rpc"
import { Routes, BlitzPage } from "@blitzjs/next"
import Search from "app/core/pages/Search"

import { ErrorBoundary } from "@blitzjs/next"
import { gSSP } from "app/blitz-server"
import {
  serverSideProps,
  ServerSidePropsContext,
} from "app/core/contextProviders/serverSidePropsProvider"

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

const SearchPage: BlitzPage = (props) => {
  // const currentUser = useCurrentUser()
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // reset the state of your app so the error doesn't happen again
      }}
    >
      <ServerSidePropsContext.Provider value={props}>
        <Layout title="Searching">
          <Suspense fallback="Loading...">
            <Search />
          </Suspense>
        </Layout>
      </ServerSidePropsContext.Provider>
    </ErrorBoundary>
  )
}

export const getServerSideProps = gSSP(serverSideProps)

export default SearchPage
