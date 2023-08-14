<template>
  <div>
    <div
      v-for="(value, prop) in cssDeclarations"
      :key="prop"
      class="mb-6"
    >
      <CanvasBlockLabel
        :label="`${prop}`"
        :value=getKeyframeValue(value)
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
    getKeyframeValue (value) {
      return JSON.stringify(value, null, 2).replace(/"/g, '')
    }
  },

  computed: {
    cssDeclarations () {
      return this.data
    }

  }
}
</script>
