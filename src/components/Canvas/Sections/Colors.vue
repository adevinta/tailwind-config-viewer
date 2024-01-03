<template>
  <div>
    <StickySectionHeader id="section-colors">
      <div class="flex gap-x-2">
        <ButtonGroup>
          <Button
            class="w-full sm:w-32"
            :selected="selectedProp === 'backgroundColor'"
            @click="selectedProp = 'backgroundColor'"
          >
            Background
          </Button>
          <Button
            class="w-full sm:w-32"
            :selected="selectedProp === 'textColor'"
            @click="selectedProp = 'textColor'"
          >
            Text
          </Button>
          <Button
            class="w-full sm:w-32"
            :selected="selectedProp === 'borderColor'"
            @click="selectedProp = 'borderColor'"
          >
            Border
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button
            :variant="'disclosure'"
            class="w-full sm:w-32"
            @click="handleDisclosures('collapse')"
          >
            Collapse all
          </Button>
          <Button
            :variant="'disclosure'"
            class="w-full sm:w-32"
            @click="handleDisclosures('expand')"
          >
            Expand all
          </Button>
        </ButtonGroup>
      </div>
    </StickySectionHeader>
    <div class="flex flex-wrap -mb-4 mt-6 gap-y-10">
      <div
        v-for="(obj, title, index) in selectedColorItems"
        :key="title"
        class="w-full"
      >
        <details ref="detailsRef">
          <summary
            @click="toggleDetail(index)"
            class="cursor-pointer dark:text-gray-500"
          >
            <div
              style="top: 2px"
              class="inline-flex mb-4 items-center relative"
            >
              <h2
                class="inline mr-2 text-2xl font-bold text-slate-900 dark:text-gray-500 capitalize"
              >
                {{ title }}:
                <span class="font-light text-sm">{{
                  getCategoryColorStats(obj)
                }}</span>
              </h2>
              <div
                :style="{
                  backgroundColor: isOpenedDetail(index)
                    ? 'transparent'
                    : getAverageColor(obj),
                  borderColor: getAverageColor(obj),
                }"
                class="w-8 h-8 border-solid border-2"
              />
            </div>
          </summary>
          <div
            class="w-full flex flex-wrap gap-4 mt-3"
            v-for="(entry, category) in obj"
            :key="category"
          >
            <h3
              v-if="category !== 'elemental'"
              class="w-full text-base font-semibold text-slate-700 lowercase -mb-2"
            >
              {{ title }} {{ category }}s
            </h3>
            <div
              v-for="(value, index) in entry"
              :key="index"
              class="w-full md:w-36"
            >
              <div
                class="mb-2 p-2 flex-none w-full md:w-36 h-16 md:h-36 flex items-center justify-center"
                :class="{
                  'border border-gray-300': selectedProp === 'textColor',
                }"
                :style="tileStyle(value[1])"
              >
                <span
                  :style="{
                    color: getMatchingTextColorDetails(value, title, category).value,
                  }"
                  v-if="selectedProp === 'backgroundColor' && getMatchingTextColorDetails(value, title, category)"
                  >
                    <CopyValue
                      :label="`${getMatchingTextColorDetails(value, title, category).label}`"
                      :value="`${getMatchingTextColorDetails(value, title, category).label}`"
                    />
                  </span
                >
                <span
                  class="text-3xl"
                  :style="{
                    color: value[1],
                  }"
                  v-if="selectedProp === 'textColor'"
                  >Aa</span
                >
              </div>
              <CanvasBlockLabel
                :label="`${selectedPropClassPrefix}-${value[0]}`"
                :value="value[1]"
              />
            </div>
          </div>
        </details>
      </div>
    </div>
  </div>
</template>

<script>
import {
  categories,
  sortColorEntries,
  getAverageColor,
  groupColorsBySubCategory
} from '@/utils/colors'
import CanvasBlockLabel from '../CanvasBlockLabel'
import CopyValue from '../CopyValue.vue'
import ButtonGroup from '../../ButtonGroup'
import Button from '../../Button'
import StickySectionHeader from '../../StickySectionHeader'

export default {
  components: {
    CanvasBlockLabel,
    CopyValue,
    ButtonGroup,
    Button,
    StickySectionHeader
  },
  mounted () {
    const detailsRef = this.$refs.detailsRef

    detailsRef.forEach((detailsElm, index) => {
      this.openedDetails.push(index)
      detailsElm.setAttribute('open', '')
    })
  },

  props: {
    data: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      selectedProp: 'backgroundColor',
      openedDetails: []
    }
  },

  computed: {
    selectedColorItems () {
      const obj = {
        backgroundColor: this.groupAndReorderColors(
          this.data,
          'backgroundColor'
        ),
        textColor: this.groupAndReorderColors(this.data, 'textColor'),
        borderColor: this.groupAndReorderColors(this.data, 'borderColor')
      }

      return obj[this.selectedProp]
    },

    selectedPropClassPrefix () {
      const map = {
        backgroundColor: 'bg',
        textColor: 'text',
        borderColor: 'border'
      }

      return map[this.selectedProp]
    }
  },

  methods: {
    isOpenedDetail (index) {
      return this.openedDetails.includes(index)
    },
    toggleDetail (index) {
      const isOpenedDetail = this.isOpenedDetail(index)
      if (isOpenedDetail) {
        this.openedDetails = this.openedDetails.filter((i) => i !== index)
      } else {
        this.openedDetails = Array.from(
          new Set([...this.openedDetails, index])
        )
      }
    },
    getCategoryColorStats (obj) {
      const coreCount = Object.keys(obj['elemental'] || {}).length
      const variantCount = Object.keys(obj['variant'] || {}).length
      const containerCount = Object.keys(obj['container'] || {}).length

      const counts = [
        coreCount ? `core: ${coreCount}` : '',
        variantCount ? `variant: ${variantCount}` : '',
        containerCount ? `container: ${containerCount}` : ''
      ]

      return `(${counts.filter(Boolean).join(', ')})`
    },
    handleDisclosures (action) {
      const detailsRef = this.$refs.detailsRef

      action === 'expand'
        ? detailsRef.forEach((detailsElm, index) => {
          this.openedDetails = Array.from(
            new Set([...this.openedDetails, index])
          )
          detailsElm.setAttribute('open', '')
        })
        : detailsRef.forEach((detailsElm, index) => {
          this.openedDetails = []
          detailsElm.removeAttribute('open')
        })
    },
    groupAndReorderColors (obj, field) {
      const entries = Object.entries(obj[field]).filter(([key]) => {
        if (field === 'backgroundColor') return !/^on-/.test(key) // filter out 'bg-on-*' tokens
        return !/ed$/.test(key) // filter out tokens that end up with hovered | pressed | focused
      })

      function groupAndReorder (groupName) {
        return groupColorsBySubCategory(
          sortColorEntries(entries.filter(([key]) => key.includes(groupName)))
        )
      }

      const reorderedObject = Object.keys(categories).reduce(
        (acc, category) => {
          acc[category] = groupAndReorder(category)

          return acc
        },
        {}
      )

      const otherEntries = groupColorsBySubCategory(
        sortColorEntries(
          entries.filter(
            ([key]) =>
              !Object.keys(categories).some((cat) => new RegExp(cat).test(key))
          )
        )
      )

      return { ...reorderedObject, other: otherEntries }
    },
    getMatchingTextColorDetails (value, title, category) {
      const textColorObj = this.groupAndReorderColors(this.data, 'textColor')
      if (/ed$/.test(value[0])) return // tokens that end up with hovered | pressed | focused
      if (!textColorObj[title]) return

      const tuple = textColorObj[title][category][`on-${title}-${category}`]
      const coreTuple = textColorObj[title][category][`on-${title}`]

      if (!tuple && !coreTuple) return

      if (tuple) {
        return { label: `text-on-${title}-${category}`, value: tuple[1] }
      }

      if (coreTuple) {
        return value[0].includes('inverse')
          ? {
            label: `text-on-${title}-inverse`,
            value: textColorObj[title][category][`on-${title}-inverse`][1]
          }
          : { label: `text-on-${title}`, value: coreTuple[1] }
      }
    },
    getAverageColor (colorsObj) {
      const hexCodes = Object.keys(colorsObj)
        .flatMap((key) =>
          Object.keys(colorsObj[key]).map((k) => colorsObj[key][k].at(-1))
        )
        .filter((hexCode) => /^#/.test(hexCode))

      return getAverageColor(hexCodes)
    },
    tileStyle (value) {
      if (this.selectedProp === 'backgroundColor') {
        return {
          backgroundColor: value
        }
      }

      if (this.selectedProp === 'borderColor') {
        return {
          border: `2px solid ${value}`
        }
      }
    }
  }
}
</script>
