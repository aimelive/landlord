<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  title: string
  icon: Component
}>()
</script>

<template>
  <section
    class="rounded-2xl border p-5"
    style="
      border-color: rgba(3, 26, 96, 0.12);
      background: rgba(3, 26, 96, 0.03);
    "
  >
    <div class="flex gap-3">
      <component :is="icon" :size="18" color="#031a60" class="shrink-0 mt-0.5" />
      <div class="flex-1 text-sm" style="color: #6b7294">
        <p class="font-semibold mb-0.5" style="color: #031a60">
          {{ title }}
        </p>
        <slot />
      </div>
    </div>
    <div
      v-if="$slots.footer"
      class="mt-4 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      style="border-top: 1px solid rgba(3, 26, 96, 0.08)"
    >
      <slot name="footer" />
    </div>
  </section>
</template>
