<script setup lang="ts">
import { AlertCircle, CheckCircle2 } from "lucide-vue-next";

defineProps<{
  show: boolean;
  tone?: "error" | "success";
}>();
</script>

<template>
  <Transition name="fa">
    <div v-if="show" class="fa-wrap">
      <div class="fa-inner">
        <div
          class="flex items-start gap-2 text-sm px-3 py-2.5 rounded-xl border"
          :style="
            tone === 'success'
              ? 'background:rgba(41,159,77,0.06); border-color:rgba(41,159,77,0.25); color:#1f7a3a'
              : 'background:rgba(220,38,38,0.05); border-color:rgba(220,38,38,0.2); color:#dc2626'
          "
        >
          <component
            :is="tone === 'success' ? CheckCircle2 : AlertCircle"
            :size="15"
            class="shrink-0 mt-0.5"
          />
          <span><slot /></span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Same grid-rows 0fr↔1fr trick as FieldMsg - animates height natively
   and also collapses the bottom gap so the form doesn't jump. */
.fa-wrap {
  display: grid;
  grid-template-rows: 1fr;
  margin-bottom: 1rem;
}
.fa-inner {
  overflow: hidden;
  min-height: 0;
}

.fa-enter-from,
.fa-leave-to {
  grid-template-rows: 0fr;
  opacity: 0;
  margin-bottom: 0;
}
.fa-enter-active,
.fa-leave-active {
  transition:
    grid-template-rows 0.28s cubic-bezier(0.33, 1, 0.68, 1),
    margin-bottom 0.28s cubic-bezier(0.33, 1, 0.68, 1),
    opacity 0.2s ease;
}

@media (prefers-reduced-motion: reduce) {
  .fa-enter-active,
  .fa-leave-active {
    transition: none;
  }
}
</style>
