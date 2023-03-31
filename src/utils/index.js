export const removeDefaultSuffix = str => str.replace(/-(default|DEFAULT)/, '')

const getRemEquivalentValue = (remValue, htmlFontSize) => {
  const defaultBrowserBase = 16
  const pxValue = parseFloat(remValue) * defaultBrowserBase
  return `${pxValue / htmlFontSize}rem`
}

export const remToPx = (rem, config) => {
  // if non rem value passed in return value as is
  if (typeof rem === 'string' && rem.search('rem') === -1) {
    return parseFloat(rem)
  }

  const defaultBrowserBase = 16
  const pxValue = parseFloat(rem) * defaultBrowserBase

  return pxValue
}

export const appendPxToRems = (rem, config) => {
  if (rem.search('rem') === -1) return rem

  return rem.replaceAll(/(\d|\.)*rem/g, (value) => {
    return `${getRemEquivalentValue(value, config.theme.configViewer.baseFontSize)} (${remToPx(value, config)}px)`
  })
}
