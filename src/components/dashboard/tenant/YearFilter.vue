<script setup lang="ts">
defineProps<{
  years: string[]
  selected: string
}>()

const emit = defineEmits<{
  (e: 'change', year: string): void
}>()
</script>

<template>
  <div class="flex items-center gap-2 flex-wrap mb-7">
    <span class="text-xs font-semibold uppercase tracking-wider" style="color:#a8adc1">
      Filter by year:
    </span>
    <button
      v-for="y in ['All', ...years]"
      :key="y"
      class="border-2 rounded-full px-3.5 py-1 text-sm font-medium cursor-pointer font-sans
             transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      :style="selected === y
        ? 'background:#031a60; border-color:#031a60; color:white; box-shadow:0 2px 8px rgba(3,26,96,0.25)'
        : 'background:white; border-color:#dce1e9; color:#1a2847'"
      @mouseenter="(e) => { if (selected !== y) (e.currentTarget as HTMLElement).style.borderColor = '#031a60' }"
      @mouseleave="(e) => { if (selected !== y) (e.currentTarget as HTMLElement).style.borderColor = '#dce1e9' }"
      @click="emit('change', y)"
    >
      {{ y }}
    </button>
  </div>
</template>
