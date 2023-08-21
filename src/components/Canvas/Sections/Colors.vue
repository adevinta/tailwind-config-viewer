<template>
  <div>
    <StickySectionHeader id="section-colors">
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
    </StickySectionHeader>
    <div class="flex flex-wrap -mb-4 mt-6 gap-y-20">
      <div
        v-for="(obj, title) in selectedColorItems"
        :key="title"
        class="w-full flex flex-wrap gap-4"
      >
        <h2 class="w-full text-xl font-bold text-slate-900 capitalize">{{ title }}:</h2>
        <div
          v-for="(value, index) in obj"
          :key="index"
          class="w-full md:w-36"
        >
          <div
            class="mb-2 flex-none w-full md:w-36 h-16 md:h-36 flex items-center justify-center"
            :class="{'border border-gray-300': selectedProp === 'textColor'}"
            :style="tileStyle(value[1])">
            <span
              class="text-3xl"
              :style="{
                color: value[1]
              }"
              v-if="selectedProp === 'textColor'">Aa</span>
          </div>
          <CanvasBlockLabel
            :label="`${selectedPropClassPrefix}-${value[0]}`"
            :value="value[1]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { categories, sortColorEntries } from '@/utils/colors'
import CanvasBlockLabel from '../CanvasBlockLabel'
import ButtonGroup from '../../ButtonGroup'
import Button from '../../Button'
import StickySectionHeader from '../../StickySectionHeader'

export default {
  components: {
    CanvasBlockLabel,
    ButtonGroup,
    Button,
    StickySectionHeader
  },

  props: {
    data: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      selectedProp: 'backgroundColor'
    }
  },

  computed: {
    selectedColorItems () {
      const obj = {
        backgroundColor: this.groupAndReorderColors(this.data.backgroundColor),
        textColor: this.groupAndReorderColors(this.data.textColor),
        borderColor: this.groupAndReorderColors(this.data.borderColor)
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
    groupAndReorderColors (obj) {
      const entries = Object.entries(obj)

      function groupAndSort (groupName) {
        return sortColorEntries(entries.filter(([key]) => key.includes(groupName)))
      }

      const mainKeys = groupAndSort(categories.main)
      const supportKeys = groupAndSort(categories.support)
      const accentKeys = groupAndSort(categories.accent)
      const basicKeys = groupAndSort(categories.basic)
      const neutralKeys = groupAndSort(categories.neutral)
      const surfaceKeys = groupAndSort(categories.surface)
      const backgroundKeys = groupAndSort(categories.background)
      const outlineKeys = groupAndSort(categories.outline)
      const overlayKeys = groupAndSort(categories.overlay)
      const infoKeys = groupAndSort(categories.info)
      const successKeys = groupAndSort(categories.success)
      const alertKeys = groupAndSort(categories.alert)
      const errorKeys = groupAndSort(categories.error)

      const otherEntries = sortColorEntries(entries
        .filter(([key]) => !Object.keys(categories)
          .some(cat => new RegExp(cat).test(key))))

      const reorderedObject = {
        main: mainKeys,
        support: supportKeys,
        accent: accentKeys,
        basic: basicKeys,
        neutral: neutralKeys,
        surface: surfaceKeys,
        background: backgroundKeys,
        outline: outlineKeys,
        overlay: overlayKeys,
        info: infoKeys,
        success: successKeys,
        alert: alertKeys,
        error: errorKeys,
        other: otherEntries
      }

      return reorderedObject
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
