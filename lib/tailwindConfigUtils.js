const path = require('path')
const deepmerge = require('deepmerge')

/**
 * Force loading tailwindcss module installed in current working directory.
 * This is required for running the config viewer directly with npx without
 * locally installing it
 */
const { toTailwindConfigViewer } = require('./utils')
const tailwindPackageJsonPath = require.resolve('tailwindcss/package.json', { paths: [__dirname, process.cwd()] })
const tailwindVersion = require(tailwindPackageJsonPath).version
const tailwindResolveConfigPath = require.resolve('tailwindcss/resolveConfig', { paths: [__dirname, process.cwd()] })
const resolveTailwindConfig = require(tailwindResolveConfigPath)
const flattenColorPalettePath = require.resolve('tailwindcss/lib/util/flattenColorPalette', { paths: [__dirname, process.cwd()] })
const flattenColorPalette = require(flattenColorPalettePath).default

const resolveConfigPath = configPath => path.resolve(process.cwd(), configPath)

const resolveConfig = config => {
  return transformConfig(resolveTailwindConfig(config))
}

const resolveConfigToJson = async (configPath) => {
  const config = await import(configPath)
  return JSON.stringify(resolveConfig(config.default || config))
}

const transformConfig = config => {
  const configCopy = deepmerge(config, {}) // make a copy of the config before it is mutated

  const themesPlugin = config.plugins.find(plugin => {
    return !!plugin.__options.themes
  })

  const themeKeys = (() => {
    if (!themesPlugin) return []
    return Object.keys(themesPlugin.__options.themes)
  })()

  config.theme = {
    ...config.theme,
    configViewer: {
      ...config.theme.configViewer,
      themeReplacements: toTailwindConfigViewer(themesPlugin.__options.themes[themeKeys[0]])
    }
  }

  config.tailwindVersion = tailwindVersion
  config.theme = replaceWithOverrides(config.theme)
  config.theme.colors = flattenColorPalette(config.theme.colors)
  config.theme.backgroundColor = flattenColorPalette(config.theme.backgroundColor)
  config.theme.textColor = flattenColorPalette(config.theme.textColor)
  config.theme.borderColor = flattenColorPalette(config.theme.borderColor)

  function generateThemes () {
    config.themes = {}

    themeKeys.forEach(themeKey => {
      const themeReplacements = toTailwindConfigViewer(themesPlugin.__options.themes[themeKey])

      config.themes[themeKey] = {
        theme: {
          ...configCopy.theme,
          configViewer: {
            ...configCopy.theme.configViewer,
            typographyExample: configCopy.theme.configViewer.typographyExample || 'The quick brown fox jumps over the lazy dog.',
            themeReplacements
          }
        }
      }

      config.themes[themeKey].theme = replaceWithOverrides(config.themes[themeKey].theme)

      config.themes[themeKey].theme.colors = flattenColorPalette(config.themes[themeKey].theme.colors)
      config.themes[themeKey].theme.backgroundColor = flattenColorPalette(config.themes[themeKey].theme.backgroundColor)
      config.themes[themeKey].theme.textColor = flattenColorPalette(config.themes[themeKey].theme.textColor)
      config.themes[themeKey].theme.borderColor = flattenColorPalette(config.themes[themeKey].theme.borderColor)
    })
  }

  generateThemes()

  removeDisabledCorePlugins(config)

  removeConfigProps(config, [
    'variants',
    'purge',
    'plugins',
    'corePlugins',
    'target'
  ])

  return config
}

const replaceWithOverrides = (theme) => {
  if (theme.configViewer && theme.configViewer.themeReplacements) {
    Object.keys(theme.configViewer.themeReplacements).forEach(key => {
      theme = findAndReplaceRecursively(theme, key, theme.configViewer.themeReplacements[key])
    })
  }

  return theme
}

function findAndReplaceRecursively (target, find, replaceWith) {
  if (typeof target !== 'object') {
    if (target === find) return replaceWith
    return target
  }

  return Object.keys(target)
    .reduce((carry, key) => {
      const val = target[key]
      carry[key] = findAndReplaceRecursively(val, find, replaceWith)
      return carry
    }, {})
}

const removeConfigProps = (config, props) => {
  props.forEach(prop => delete config[prop])
}

const removeDisabledCorePlugins = (config) => {
  Object.keys(config.corePlugins).forEach(key => {
    if (config.corePlugins[key] === false) {
      delete config.theme[key]
    }
  })
}

module.exports = {
  resolveConfig,
  resolveConfigPath,
  resolveConfigToJson,
  transformConfig
}
