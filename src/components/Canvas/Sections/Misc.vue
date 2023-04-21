<template>
  <div>
    <div
      v-for="(value, prop) in cssDeclarations"
      :key="prop"
      class="mb-6"
    >
      <CanvasBlockLabel
        :label="prop"
        :value="`{ ${value} }`"
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

  computed: {
    cssDeclarations () {
      return this.data
    }

  }
}
</script>
