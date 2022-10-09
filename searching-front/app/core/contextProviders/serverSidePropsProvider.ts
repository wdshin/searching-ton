import { gSSP } from "app/blitz-server"
import React from "react"

export interface ContextParamsServer {
  cookies: Record<string, string | undefined>
}

interface Props {
  props: ContextParamsServer
}

export interface ContextParams {
  theme: string;
  setTheme: (theme:'dark'| 'light')=> void;
}



export const serverSideProps = (pagePropsFunction?:()=>{}) => async ({ ctx, req }): Promise<Props> => {
  const pageProps = await pagePropsFunction?.() || {};
  return {
    props: {
      ...pageProps,
      cookies: req.cookies,
    },
  }
}

export const ServerSidePropsContext = React.createContext<ContextParams>({ cookies: {} })
