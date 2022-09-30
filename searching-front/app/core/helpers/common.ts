import classnames from "classnames"
export const cn = classnames

export const cleanUrlForUi = (url: string) => {
  return url.replace("https://", "").replace("http://", "").replace("/", "")
}

export const isNode = () => {
  return typeof window !== "object"
}
