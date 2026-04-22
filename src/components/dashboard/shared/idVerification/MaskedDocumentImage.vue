<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { Eye, EyeOff, Image as ImageIcon, Lock } from 'lucide-vue-next'

defineProps<{
  /** Cloudinary URL for the document image, or null/undefined if missing. */
  src: string | null | undefined
}>()

// Kept independent from the ID-number reveal so copying the number and
// peeking at the photo are separate intents. Auto-hide after inactivity
// matches the "brief peek" model used by banking balance reveals.
const revealed = ref(false)
const AUTO_HIDE_MS = 15_000
let hideTimer: ReturnType<typeof setTimeout> | null = null

function clearHideTimer() {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

function scheduleHide() {
  clearHideTimer()
  hideTimer = setTimeout(() => {
    revealed.value = false
    hideTimer = null
  }, AUTO_HIDE_MS)
}

function reveal() {
  revealed.value = true
  scheduleHide()
}

function hide() {
  revealed.value = false
  clearHideTimer()
}

function toggle() {
  if (revealed.value) hide()
  else reveal()
}

function onActivity() {
  // Reset the countdown on any interaction while revealed.
  if (revealed.value) scheduleHide()
}

onBeforeUnmount(clearHideTimer)
</script>

<template>
  <div
    class="rounded-xl p-3 flex items-center justify-center"
    style="background: #fafbff"
  >
    <div
      v-if="src"
      class="relative w-full rounded-lg overflow-hidden"
      @pointermove="onActivity"
    >
      <img
        :src="src"
        :alt="revealed ? 'ID document' : ''"
        :aria-hidden="!revealed"
        draggable="false"
        class="w-full aspect-[1.6/1] object-cover select-none transition-[filter,transform] duration-300"
        :style="
          revealed
            ? 'filter: none'
            : 'filter: blur(22px) brightness(1.05); transform: scale(1.08)'
        "
        @contextmenu.prevent
      />

      <!-- Scrim + lock when hidden. Clicking anywhere reveals. -->
      <button
        v-if="!revealed"
        type="button"
        @click="reveal"
        aria-label="Reveal ID image"
        aria-pressed="false"
        class="absolute inset-0 flex items-center justify-center cursor-pointer transition-opacity duration-300"
        style="
          background: linear-gradient(
            180deg,
            rgba(3, 26, 96, 0.35) 0%,
            rgba(3, 26, 96, 0.58) 100%
          );
          color: white;
        "
      >
        <div
          class="w-11 h-11 rounded-full flex items-center justify-center"
          style="background: rgba(255, 255, 255, 0.18); backdrop-filter: blur(4px)"
        >
          <Lock :size="18" />
        </div>
      </button>

      <!-- Eye toggle (always available, same vocabulary as the ID-number toggle) -->
      <button
        type="button"
        @click.stop="toggle"
        :aria-label="revealed ? 'Hide ID image' : 'Reveal ID image'"
        :aria-pressed="revealed"
        class="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors"
        style="
          background: rgba(3, 26, 96, 0.78);
          color: white;
          backdrop-filter: blur(6px);
        "
      >
        <Eye v-if="!revealed" :size="14" />
        <EyeOff v-else :size="14" />
      </button>
    </div>

    <div
      v-else
      class="w-full aspect-[1.6/1] rounded-lg flex items-center justify-center"
      style="background: #f0f2f7"
    >
      <ImageIcon :size="28" color="#a8adc1" />
    </div>
  </div>
</template>
