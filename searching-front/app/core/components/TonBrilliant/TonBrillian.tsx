import { Routes } from "@blitzjs/next"
import TonLogo from "app/core/icons/TonLogo"
import { useRouter } from "next/router"

import s from "./styles.module.css"

const TonBrilliant = () => {
  return (
    <div className={s.root}>
      <video
        className={s.video}
        width="200"
        height="200"
        autoPlay
        loop
        playsinline
        poster="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII"
        preload="auto"
        muted
        disableremoteplayback
      >
        <source src="/dimond_2-1.hevc.4d6283ed.mp4" type="video/quicktime" />
        <source src="/dimond_1_VP9.29bcaf8e.webm" type="video/webm" />
      </video>
    </div>
  )
}

export default TonBrilliant
