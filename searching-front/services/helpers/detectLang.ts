export enum Languages {
  EN = "en",
  RU = "ru",
}

export const detectLang = (text: string): Languages => {
  let lang = Languages.EN
  const ruCount = text.match(/([а-я])/g)?.length || 0
  const enCount = text.match(/([a-z])/g)?.length || 0
  if (ruCount > enCount) {
    lang = Languages.RU
  }
  return lang
}
