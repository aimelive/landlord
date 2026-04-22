<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import {
  AlertTriangle,
  Loader2,
  SwitchCamera,
  X,
} from 'lucide-vue-next'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
  capture: [file: File]
  /** User clicked the "Upload file" escape hatch on the error panel. */
  fallbackToUpload: []
}>()

const loading = ref(false)
const error = ref<string | null>(null)
const facing = ref<'environment' | 'user'>('environment')
const videoEl = ref<HTMLVideoElement | null>(null)
let stream: MediaStream | null = null

function stopStream() {
  if (stream) {
    stream.getTracks().forEach((t) => t.stop())
    stream = null
  }
  if (videoEl.value) videoEl.value.srcObject = null
}

async function startStream(target: 'environment' | 'user') {
  stopStream()
  const next = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: { ideal: target },
      width: { ideal: 1920 },
      height: { ideal: 1080 },
    },
    audio: false,
  })
  stream = next
  await nextTick()
  if (videoEl.value) {
    videoEl.value.srcObject = next
    // iOS Safari needs an explicit play() after setting srcObject.
    try {
      await videoEl.value.play()
    } catch {
      /* autoplay policy — playsinline + muted cover this */
    }
  }
}

function describeError(e: unknown): string {
  const name = (e as { name?: string })?.name ?? ''
  if (name === 'NotAllowedError' || name === 'SecurityError') {
    return 'Camera access was blocked. Allow camera permission in your browser and try again.'
  }
  if (name === 'NotFoundError' || name === 'OverconstrainedError') {
    return 'No camera was found on this device.'
  }
  if (name === 'NotReadableError') {
    return 'Your camera is already in use by another app.'
  }
  return 'Could not start the camera. You can upload a file instead.'
}

async function bootCamera() {
  loading.value = true
  error.value = null
  try {
    await startStream(facing.value)
  } catch (e) {
    error.value = describeError(e)
  } finally {
    loading.value = false
  }
}

async function switchCamera() {
  facing.value = facing.value === 'environment' ? 'user' : 'environment'
  loading.value = true
  error.value = null
  try {
    await startStream(facing.value)
  } catch (e) {
    error.value = describeError(e)
  } finally {
    loading.value = false
  }
}

function capture() {
  const video = videoEl.value
  if (!video || !video.videoWidth) return
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  canvas.toBlob(
    (blob) => {
      if (!blob) return
      const file = new File([blob], `id-${Date.now()}.jpg`, {
        type: 'image/jpeg',
      })
      emit('capture', file)
      close()
    },
    'image/jpeg',
    0.92,
  )
}

function close() {
  stopStream()
  error.value = null
  emit('close')
}

function onFallback() {
  close()
  emit('fallbackToUpload')
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) bootCamera()
    else stopStream()
  },
)

onBeforeUnmount(stopStream)
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex flex-col"
    style="background: #000"
    role="dialog"
    aria-modal="true"
    aria-label="Take a photo of your ID"
  >
    <div
      class="flex items-center justify-between px-4 py-3"
      style="background: rgba(0, 0, 0, 0.55); color: white"
    >
      <button
        type="button"
        @click="close"
        class="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer"
        style="background: rgba(255, 255, 255, 0.12)"
        aria-label="Close camera"
      >
        <X :size="18" />
      </button>
      <p class="text-sm font-semibold">Scan your ID</p>
      <button
        type="button"
        @click="switchCamera"
        :disabled="loading || !!error"
        class="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer disabled:opacity-40"
        style="background: rgba(255, 255, 255, 0.12)"
        aria-label="Switch camera"
      >
        <SwitchCamera :size="18" />
      </button>
    </div>

    <div class="flex-1 relative overflow-hidden flex items-center justify-center">
      <video
        ref="videoEl"
        class="w-full h-full object-contain"
        autoplay
        playsinline
        muted
      />

      <div
        v-if="!loading && !error"
        class="absolute inset-0 flex items-center justify-center pointer-events-none px-6"
      >
        <div
          class="w-full max-w-135 aspect-[1.6/1] rounded-2xl"
          style="
            border: 2px dashed rgba(255, 255, 255, 0.7);
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.35);
          "
        />
      </div>

      <div
        v-if="loading"
        class="absolute inset-0 flex flex-col items-center justify-center gap-2"
        style="color: white"
      >
        <Loader2 :size="28" class="animate-spin" />
        <p class="text-sm">Starting camera…</p>
      </div>

      <div
        v-if="error"
        class="absolute inset-0 flex items-center justify-center px-6"
      >
        <div
          class="rounded-2xl p-6 max-w-sm text-center"
          style="background: white"
        >
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
            style="background: rgba(239, 68, 68, 0.1)"
          >
            <AlertTriangle :size="22" color="#b91c1c" />
          </div>
          <p class="text-sm font-semibold mb-1" style="color: #031a60">
            Camera unavailable
          </p>
          <p class="text-xs mb-4" style="color: #6b7294">{{ error }}</p>
          <div class="flex gap-2">
            <button
              type="button"
              @click="close"
              class="flex-1 py-2 px-3 rounded-xl text-sm font-semibold cursor-pointer"
              style="background: white; border: 1px solid #e2e5ed; color: #031a60"
            >
              Close
            </button>
            <button
              type="button"
              @click="onFallback"
              class="flex-1 py-2 px-3 rounded-xl text-sm font-semibold cursor-pointer"
              style="background: #031a60; color: white"
            >
              Upload file
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="px-6 py-5 flex flex-col items-center gap-3"
      style="background: rgba(0, 0, 0, 0.55); color: white"
    >
      <p class="text-xs text-center" style="color: rgba(255, 255, 255, 0.8)">
        Align the front of your ID within the frame and keep it flat.
      </p>
      <button
        type="button"
        @click="capture"
        :disabled="loading || !!error"
        class="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer disabled:opacity-40 transition-transform active:scale-95"
        style="background: white; box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.25)"
        aria-label="Capture photo"
      >
        <div class="w-12 h-12 rounded-full" style="background: #031a60" />
      </button>
    </div>
  </div>
</template>
