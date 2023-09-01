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
        class="w-full"
      >
        <h2 class="w-full mb-4 text-2xl font-bold text-slate-900 capitalize">{{ title }}:</h2>
        <div
          class="w-full flex flex-wrap gap-4 mt-3"
          v-for="(entry, category) in obj"
          :key="category"
        >
          <h3 v-if="category !== 'elemental'" class="w-full text-base font-semibold text-slate-700 lowercase -mb-2">
            {{ title }} {{ category }}s
          </h3>
          <div
            v-for="(value, index) in entry"
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
  </div>
</template>

<script>
import { categories, sortColorEntries, groupColorsBySubCategory } from '@/utils/colors'
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

      function groupAndReorder (groupName) {
        return groupColorsBySubCategory(sortColorEntries(entries.filter(([key]) => key.includes(groupName))))
      }

      const reorderedObject = Object.keys(categories).reduce((acc, category) => {
        acc[category] = groupAndReorder(category)

        return acc
      }, {})

      const otherEntries = groupColorsBySubCategory(sortColorEntries(entries
        .filter(([key]) => !Object.keys(categories)
          .some(cat => new RegExp(cat).test(key)))))

      return { ...reorderedObject, other: otherEntries }
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
