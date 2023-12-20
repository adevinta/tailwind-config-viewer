<template>
  <button
    class="
      py-2 px-4
      text-sm border focus:outline-none rounded
    "
    :class="{
      'bg-gray-300 dark:bg-gray-800': selected && variant === 'default',
      'bg-white dark:bg-gray-900': !selected && variant === 'default',
      'text-gray-800 dark:text-gray-400 hover:bg-gray-300 dark-hover:bg-gray-800 border-gray-400 dark:border-gray-700': variant === 'default',
      'bg-indigo-100 dark:bg-indigo-900 text-black dark:text-white hover:bg-indigo-200 dark-hover:bg-indigo-800 border-indigo-200 dark:border-indigo-600': variant === 'disclosure',
    }"
    v-on="$listeners"
  >
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    selected: {
      type: Boolean
    },
    variant: {
      type: String,
      default: 'default'
    }
  }
}
</script>
