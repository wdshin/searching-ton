import classnames from "classnames"
export const cn = classnames

export const cleanUrlForUi = (url: string) => {
  return url.replace("https://", "").replace("http://", "")
}

export const isNode = () => {
  return typeof window !== "object"
}

export const getDomainFromUrl = (url: string) => url.match(/http:\/\/(.*).ton/)?.[1]