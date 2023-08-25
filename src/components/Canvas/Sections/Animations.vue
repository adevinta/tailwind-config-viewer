<!-- eslint-disable vue/valid-v-bind -->
<template>
  <div>
    <div
      v-for="(value, prop) in customFilter(cssDeclarations)"
      :key="prop"
      class="mb-6"
    >
      <CanvasBlockLabel
        :label="`animate-${prop}`"
        :value=getAnimationValue(value)
      />
    </div>
  </div>

</template>

<script>

import CanvasBlockLabel from '../CanvasBlockLabel'

export default {
  components: {
    CanvasBlockLabel
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    config: {
      type: Object
    }
  },
  methods: {
    getAnimationValue (value) {
      return `animation: ${JSON.stringify(value, null, 2)};`.replace(/"/g, '')
    },
    customFilter (obj) {
      const filteredObj = Object.keys(obj).reduce((acc, cur) => {
        if (/^standalone/i.test(cur)) return acc
        acc[cur] = obj[cur]

        return acc
      }, {})

      return filteredObj
    }
  },

  computed: {
    cssDeclarations () {
      return this.data
    }

  }
}
</script>
