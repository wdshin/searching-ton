import { cleanUrlForUi } from "app/core/helpers/common"
import { useEffect, useState } from "react"
import s from "./styles.module.css"

interface Props {
  url: string
  title: string
  description: string
  faviconUrl?: string
}
const WebsiteCard = (props: Props) => {
  const faviconUrl = props.faviconUrl;
  const [faviconLoaded, setFaviconLoaded] = useState(false)
  useEffect(() => {
    if (faviconUrl) {
      const faviconNode = document.createElement("img")
      faviconNode.src = faviconUrl;
      faviconNode.onload = () => {
        setFaviconLoaded(true)
      }
    }
  }, [faviconUrl])
  const urlObj = new URL(props.url)
  urlObj.searchParams.set("from", "Searching.ton")

  const url = urlObj.toString()

  return (
    <div className={s.root}>
      {faviconLoaded &&<img className={(s.favicon)} src={faviconUrl} />}
      <a target="_blank" className={s.titleLink} href={url}>
        {props.title}
      </a>
      <a target="_blank" className={s.miniLink} href={url}>
        {cleanUrlForUi(props.url)}
      </a>
      <div className={s.description}>{props.description}</div>
    </div>
  )
}

export default WebsiteCard
