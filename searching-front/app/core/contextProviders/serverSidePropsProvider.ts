import { gSSP } from "app/blitz-server"
import React from "react"

interface ContextParams {
  cookies: Record<string, string | undefined>
}

interface Props {
  props: ContextParams
}

export const serverSideProps = async ({ ctx, req }): Promise<Props> => {
  return {
    props: {
      cookies: req.cookies,
    },
  }
}

export const ServerSidePropsContext = React.createContext<ContextParams>({ cookies: {} })
