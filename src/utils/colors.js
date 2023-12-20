export function sortColorEntries (entries) {
  const order = [
    /^([^-]+)$/, // value
    /^on-([^-]+)$/, // on-value
    /^([^-]+)-hovered$/, // value-hovered
    /^([^-]+)-pressed$/, // value-pressed
    /^([^-]+)-focused$/, // value-focused
    /^([^-]+)-variant$/, // value-variant
    /^on-([^-]+)-variant$/, // on-value-variant
    /^([^-]+)-variant-hovered$/, // value-variant-hovered
    /^([^-]+)-variant-pressed$/, // value-variant-pressed
    /^([^-]+)-variant-focused$/, // value-variant-focused
    /^([^-]+)-container$/, // value-container
    /^on-([^-]+)-container$/, // on-value-container
    /^([^-]+)-container-hovered$/, // value-container-hovered
    /^([^-]+)-container-pressed$/, // value-container-pressed
    /^([^-]+)-container-focused$/ // value-container-focused
  ]

  const getIndex = key => {
    for (let i = 0; i < order.length; i++) {
      const match = key.match(order[i])
      if (match) {
        return [i, match[1]]
      }
    }
    return [order.length, '']
  }

  return entries.sort((a, b) => {
    const [indexA, dynamicValueA] = getIndex(a[0])
    const [indexB, dynamicValueB] = getIndex(b[0])

    return indexA - indexB || dynamicValueA.localeCompare(dynamicValueB)
  })
}

export function groupColorsBySubCategory (entries) {
  const categorizedColors = {
    elemental: {},
    variant: {},
    container: {}
  }

  entries.forEach(entry => {
    const [label] = entry

    if (label.split('-').includes('variant')) {
      categorizedColors.variant[label] = entry

      return
    }

    if (label.split('-').includes('container')) {
      categorizedColors.container[label] = entry

      return
    }

    categorizedColors.elemental[label] = entry
  })

  if (!Object.keys(categorizedColors.variant).length) delete categorizedColors.variant
  if (!Object.keys(categorizedColors.container).length) delete categorizedColors.container

  return categorizedColors
}

export const categories = {
  main: 'main',
  support: 'support',
  accent: 'accent',
  info: 'info',
  success: 'success',
  alert: 'alert',
  error: 'error',
  basic: 'basic',
  neutral: 'neutral',
  surface: 'surface',
  background: 'background',
  outline: 'outline',
  overlay: 'overlay'
}
