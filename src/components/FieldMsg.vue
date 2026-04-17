<script setup lang="ts">
defineProps<{
  show: boolean
  tone?: 'error' | 'success'
}>()
</script>

<template>
  <Transition name="fm">
    <div
      v-if="show"
      class="fm-grid"
      :class="tone === 'success' ? 'fm-tone-success' : 'fm-tone-error'"
    >
      <div class="fm-inner">
        <slot />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Grid-rows 0fr → 1fr animates from 0 → auto height natively —
   no max-height cap, wraps cleanly at any length. */
.fm-grid {
  display: grid;
  grid-template-rows: 1fr;
  font-size: 0.75rem;
  line-height: 1.35;
}
.fm-tone-error   { color: #ef4444; }
.fm-tone-success { color: #299f4d; }

.fm-inner {
  overflow: hidden;
  min-height: 0;
}

.fm-enter-from,
.fm-leave-to {
  grid-template-rows: 0fr;
  opacity: 0;
}
.fm-enter-active,
.fm-leave-active {
  transition:
    grid-template-rows 0.26s cubic-bezier(0.33, 1, 0.68, 1),
    opacity 0.18s ease;
}

@media (prefers-reduced-motion: reduce) {
  .fm-enter-active,
  .fm-leave-active { transition: none; }
}
</style>
