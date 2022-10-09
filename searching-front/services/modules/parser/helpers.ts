import textversion from "textversionjs"

const convert = (html: string) =>
  textversion(html, {
    linkProcess: function (href, linkText) {
      return linkText || "HUJ"
    },
    imgProcess: function (src, alt) {
      return alt
    },
    headingStyle: "linebreak",
    listStyle: "linebreak",
  })
export const htmlToText = (html: string) => {
  try {
    const text = convert(html)
    return text
      .replaceAll(/&\w*;/g, "")
      .replaceAll(/<!--\s?(.|\R|\s)*?-->/g, "")
      .replaceAll(/<.*><\/.*>/g, "")
  } catch (e) {
    console.log("htmlToText", e)
    return ""
  }
}

export const SHOULD_NOT_PARSE = "SHOULD_NOT_PARSE"
