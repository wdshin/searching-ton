import s from "./styles.module.css"

const ThemeSwitcher = () => {
  return (
    <div className={s.root}>
      <div className={s.wrapper}>
        <input type="checkbox" id="hide-checkbox" className={s.hideCheckbox} />
        <label htmlFor="hide-checkbox" className={s.toggle}>
          <span className={s.toggleButton}>
            <span className={(s.crater, s.crater1)}></span>
            <span className={(s.crater, s.crater2)}></span>
            <span className={(s.crater, s.crater3)}></span>
            <span className={(s.crater, s.crater4)}></span>
            <span className={(s.crater, s.crater5)}></span>
            <span className={(s.crater, s.crater6)}></span>
            <span className={(s.crater, s.crater7)}></span>
          </span>
          <span className={(s.star, s.star1)}></span>
          <span className={(s.star, s.star2)}></span>
          <span className={(s.star, s.star3)}></span>
          <span className={(s.star, s.star4)}></span>
          <span className={(s.star, s.star5)}></span>
          <span className={(s.star, s.star6)}></span>
          <span className={(s.star, s.star7)}></span>
          <span className={(s.star, s.star8)}></span>
        </label>
      </div>
    </div>
  )
}

export default ThemeSwitcher
