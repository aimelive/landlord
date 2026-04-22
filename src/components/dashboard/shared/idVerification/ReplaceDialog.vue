<script setup lang="ts">
import { Loader2, Trash2 } from 'lucide-vue-next'
import FormAlert from '../../../FormAlert.vue'

const props = defineProps<{
  open: boolean
  deleting: boolean
  error: string | null
}>()

const emit = defineEmits<{
  close: []
  confirm: []
}>()

function close() {
  if (props.deleting) return
  emit('close')
}

function confirm() {
  if (props.deleting) return
  emit('confirm')
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center px-4"
    style="background: rgba(3, 26, 96, 0.45); backdrop-filter: blur(4px)"
    role="dialog"
    aria-modal="true"
    aria-labelledby="replace-dialog-title"
    @click.self="close"
  >
    <div
      class="w-full max-w-md rounded-2xl bg-white p-6"
      style="box-shadow: 0 20px 50px rgba(3, 26, 96, 0.25)"
    >
      <div class="flex gap-3 mb-4">
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style="background: rgba(239, 68, 68, 0.1)"
        >
          <Trash2 :size="18" color="#b91c1c" />
        </div>
        <div class="flex-1">
          <h3
            id="replace-dialog-title"
            class="text-base font-bold mb-1"
            style="color: #031a60"
          >
            Replace your ID photo?
          </h3>
          <p class="text-sm" style="color: #6b7294">
            Your current submission will be deleted and you'll need to upload a
            new photo. This can't be undone.
          </p>
        </div>
      </div>

      <FormAlert :show="!!error" tone="error">
        {{ error }}
      </FormAlert>

      <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
        <button
          type="button"
          @click="close"
          :disabled="deleting"
          class="py-2.5 px-4 rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-60 transition-colors"
          style="background: white; border: 1px solid #e2e5ed; color: #031a60"
        >
          Keep current photo
        </button>
        <button
          type="button"
          @click="confirm"
          :disabled="deleting"
          class="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-60 transition-colors"
          style="
            background: #b91c1c;
            color: white;
            box-shadow: 0 6px 16px rgba(185, 28, 28, 0.22);
          "
        >
          <Loader2 v-if="deleting" :size="14" class="animate-spin" />
          <Trash2 v-else :size="14" />
          {{ deleting ? 'Deleting…' : 'Delete and replace' }}
        </button>
      </div>
    </div>
  </div>
</template>
