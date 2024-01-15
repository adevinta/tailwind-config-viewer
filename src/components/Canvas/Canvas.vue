<template>
  <div class="bg-gray-100 dark:bg-midnight">
    <div
      v-if="!config"
      style="height: calc(100vh - 63px);"
      class="flex items-center justify-center">
        <p class="text-gray-600 text-center font-bold">Loading Config...</p>
    </div>
    <template v-if="config">
      <div class="pt-8 px-3 flex">
        <div class="hidden md:block flex-none h-full overflow-y-auto top-0 sticky max-h-screen pt-2">
          <ToggleSwitch
            name="dark-mode"
            class="mb-3 ml-3"
            :value="darkMode"
            @input="$emit('toggle-dark-mode', $event)"
            label="Dark Mode"
          />
          <div class="ml-3 text-sm text-gray-700 dark:text-gray-500">Tailwind v{{ config.tailwindVersion }}</div>
          <p class="ml-3 mt-3 text-lg font-semibold text-pink-400 dark:text-purple-400">Active theme:</p>
          <Select
            class="w-10/12 ml-3 mt-1 mb-4"
            :options="themeOptions"
            v-model="activeTheme"
          />
          <nav class="pt-3 pr-20 pb-12 px-3 h-full">
            <a
              v-for="section in configTransformed"
              :key="section.title"
              :href="`#${section.title}`"
              class="relative flex items-center py-2 hover:text-gray-900 dark-hover:text-gray-200 text-base rounded-sm"
              :class="[activeSection === section ? 'text-gray-900 dark:text-gray-200' : 'text-gray-700 dark:text-gray-500']"
              @click="setActiveSection(section)"
            >
              <div
                class="absolute rounded-full bg-gray-500 dark:bg-gray-600 transition duration-200"
                :class="[activeSection === section ? 'visible opacity-100' : 'invisible opacity-0']"
                :style="{width: '5px', height: '5px', left: '-12px'}"
              />
              {{ section.title }}
            </a>
          </nav>
        </div>
        <div class="md:pl-4">
          <CanvasSection
            v-for="section in configTransformed"
            :key="section.title"
            :title="section.title"
            :id="section.title"
          >
            <Intersect
              :threshold="[0.0]"
              rootMargin="-40% 0px -60% 0px"
              @enter="setActiveSection(section)"
              @leaave="setActiveSection(null)"
            >
              <component
                :is="sectionComponent(section.component)"
                :data="section.data"
                :config="config"
              />
            </Intersect>
          </CanvasSection>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import defu from 'defu'
import Intersect from 'vue-intersect'
import themeComponentMapper from './themeComponentMapper'
import fontTagCreator from './fontTagCreator'
import CanvasSection from './CanvasSection'
import ToggleSwitch from '../ToggleSwitch'
import Select from '../Select'
import defaultOptions from '../../defaultOptions'

export default {
  components: {
    CanvasSection,
    ToggleSwitch,
    Intersect,
    Select
  },

  provide () {
    return {
      prefixClassName: this.prefixClassName,
      getConfig: this.getConfig
    }
  },

  props: {
    darkMode: {
      type: Boolean,
      required: false
    }
  },

  data () {
    return {
      activeSection: null,
      activeTheme: '',
      config: null,
      configTransformed: null,
      themeOptions: []
    }
  },

  methods: {
    sectionComponent (component) {
      return require(`./Sections/${component}.vue`).default
    },

    prefixClassName (className) {
      return this.config.prefix ? `${this.config.prefix}${className}` : className
    },

    getConfig () {
      return this.config
    },

    setActiveSection (section) {
      this.activeSection = section
    },
    async themeChanged () {
      if (!this.activeTheme) return

      this.configTransformed = themeComponentMapper(this.config.themes[this.activeTheme])
      fontTagCreator(this.config.themes[this.activeTheme].theme)
    }
  },

  watch: {
    activeTheme: {
      handler: 'themeChanged',
      immediate: true
    }
  },

  async mounted () {
    const config = await fetch(window.__TCV_CONFIG.configPath)
    this.config = await config.json()
    this.config = defu(this.config, defaultOptions)

    const themeOptions = Object.keys(this.config.themes).reduce((acc, themeKey) => {
      acc[themeKey] = themeKey

      return acc
    }, {})

    const initialActiveTheme = themeOptions[Object.keys(themeOptions)[0]]

    this.configTransformed = themeComponentMapper(this.config.themes[initialActiveTheme])
    fontTagCreator(this.config.themes[initialActiveTheme].theme)

    this.themeOptions = themeOptions
    this.activeTheme = initialActiveTheme

    setTimeout(() => {
      const headings = Array.from(document.querySelectorAll('h1'))
      const scrollTarget = headings.find(
        ({ textContent }) =>
          textContent === decodeURI(window.location.hash).replace('#', ''))

      if (scrollTarget) {
        scrollTarget.scrollIntoView({
          behavior: 'smooth'
        })
      }
    }, 500)
  }
}
</script>
