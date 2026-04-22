<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import {
  BookUser,
  Camera,
  IdCard,
  Image as ImageIcon,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Upload,
  X,
} from "lucide-vue-next";
import FormAlert from "../../../FormAlert.vue";
import CameraModal from "./CameraModal.vue";
import ScanningOverlay from "./ScanningOverlay.vue";

type DocType = "national_id" | "passport";

const props = defineProps<{
  submitting: boolean;
  /** Server-side submit error; null clears the alert. */
  error: string | null;
}>();

const emit = defineEmits<{
  submit: [file: File];
}>();

// ── Doc type picker ─────────────────────────────────────────────
const docType = ref<DocType>("national_id");

// ── File state ──────────────────────────────────────────────────
const file = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const localError = ref<string | null>(null);
const dragActive = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const cameraInput = ref<HTMLInputElement | null>(null);

// ── Camera ──────────────────────────────────────────────────────
const cameraOpen = ref(false);

// ── Validation ──────────────────────────────────────────────────
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXT = ["jpg", "jpeg", "png", "webp", "heic", "heif"];

function validate(f: File): string | null {
  if (f.size > MAX_BYTES)
    return "That image is over 5 MB. Please upload a smaller one.";
  const ext = f.name.includes(".")
    ? f.name.split(".").pop()!.toLowerCase()
    : "";
  const ct = (f.type || "").toLowerCase();
  const typeOk = ct.startsWith("image/") || ALLOWED_EXT.includes(ext);
  if (!typeOk) return "Unsupported file type. Use JPEG, PNG, WebP, or HEIC.";
  return null;
}

function clearPreview() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  previewUrl.value = null;
  file.value = null;
  localError.value = null;
}

function setFile(f: File) {
  const err = validate(f);
  if (err) {
    localError.value = err;
    return;
  }
  clearPreview();
  file.value = f;
  // HEIC previews don't render in most browsers — we show a filename placeholder.
  const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
  const previewable =
    !["heic", "heif"].includes(ext) &&
    !f.type.includes("heic") &&
    !f.type.includes("heif");
  previewUrl.value = previewable ? URL.createObjectURL(f) : null;
  localError.value = null;
  // Auto-scan: the typical path is "this is the photo I want".
  emit("submit", f);
}

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const f = target.files?.[0];
  if (f) setFile(f);
  target.value = "";
}

function onDrop(e: DragEvent) {
  e.preventDefault();
  dragActive.value = false;
  const f = e.dataTransfer?.files?.[0];
  if (f) setFile(f);
}

function onDragOver(e: DragEvent) {
  e.preventDefault();
  dragActive.value = true;
}

function onDragLeave() {
  dragActive.value = false;
}

// ── Camera lifecycle ────────────────────────────────────────────
function hasGetUserMedia(): boolean {
  return !!navigator.mediaDevices?.getUserMedia;
}

function openCamera() {
  // Fallback to the native file input when getUserMedia is unavailable
  // (older iOS WebViews, restricted contexts).
  if (!hasGetUserMedia()) {
    cameraInput.value?.click();
    return;
  }
  cameraOpen.value = true;
}

function onCameraCapture(captured: File) {
  setFile(captured);
}

function onCameraFallback() {
  fileInput.value?.click();
}

// Manual retry of the *same* file (e.g. after a backend error).
function retrySubmit() {
  if (file.value && !props.submitting) emit("submit", file.value);
}

onBeforeUnmount(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
});
</script>

<template>
  <section
    class="rounded-2xl bg-white border p-6"
    style="border-color: #e8eaf0"
  >
    <h2 class="text-sm font-bold mb-1" style="color: #031a60">
      Choose your document
    </h2>
    <p class="text-xs mb-4" style="color: #a8adc1">
      Rwandans use the National ID. Non-Rwandans use a Passport.
    </p>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <button
        type="button"
        @click="docType = 'national_id'"
        class="flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all cursor-pointer"
        :style="
          docType === 'national_id'
            ? 'border-color:#031a60; background:rgba(3,26,96,0.04)'
            : 'border-color:#e8eaf0; background:white'
        "
      >
        <div
          class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          :style="
            docType === 'national_id'
              ? 'background:#031a60'
              : 'background:rgba(3,26,96,0.08)'
          "
        >
          <IdCard
            :size="18"
            :color="docType === 'national_id' ? 'white' : '#031a60'"
          />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <p class="text-sm font-bold" style="color: #031a60">National ID</p>
            <span
              v-if="docType === 'national_id'"
              class="text-xs font-semibold px-2 py-0.5 rounded-full"
              style="background: #031a60; color: white"
            >
              Selected
            </span>
          </div>
          <p class="text-xs mt-0.5" style="color: #6b7294">
            Rwandan Indangamuntu — front side
          </p>
        </div>
      </button>

      <button
        type="button"
        disabled
        class="flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all cursor-not-allowed"
        style="border-color: #e8eaf0; background: #fafbff; opacity: 0.7"
        title="Passport support is coming soon"
      >
        <div
          class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style="background: rgba(107, 114, 148, 0.12)"
        >
          <BookUser :size="18" color="#6b7294" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <p class="text-sm font-bold" style="color: #031a60">Passport</p>
            <span
              class="text-xs font-semibold px-2 py-0.5 rounded-full"
              style="background: rgba(107, 114, 148, 0.15); color: #4a5168"
            >
              Coming soon
            </span>
          </div>
          <p class="text-xs mt-0.5" style="color: #6b7294">
            For non-Rwandan residents
          </p>
        </div>
      </button>
    </div>
  </section>

  <section
    class="rounded-2xl bg-white border p-6"
    style="border-color: #e8eaf0"
  >
    <h2 class="text-sm font-bold mb-1" style="color: #031a60">
      Upload your ID photo
    </h2>
    <p class="text-xs mb-4" style="color: #a8adc1">
      JPEG, PNG, WebP, or HEIC. Maximum 5 MB.
    </p>

    <FormAlert :show="!!(localError || error)" tone="error">
      {{ localError || error }}
    </FormAlert>

    <div v-if="file" class="space-y-4">
      <div
        class="relative rounded-xl border overflow-hidden"
        style="border-color: #e8eaf0; background: #f7f8fc"
      >
        <img
          v-if="previewUrl"
          :src="previewUrl"
          alt="ID preview"
          class="w-full max-h-105 object-contain"
        />
        <div
          v-else
          class="w-full aspect-[1.6/1] flex flex-col items-center justify-center gap-2 text-center px-6"
        >
          <ImageIcon :size="32" color="#a8adc1" />
          <p class="text-sm font-medium" style="color: #031a60">
            {{ file.name }}
          </p>
          <p class="text-xs" style="color: #6b7294">
            HEIC previews aren't supported in this browser, but we'll process it
            server-side.
          </p>
        </div>

        <ScanningOverlay :active="submitting" />

        <button
          type="button"
          @click="clearPreview"
          :disabled="submitting"
          class="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer disabled:opacity-50 z-10"
          style="background: rgba(0, 0, 0, 0.55); color: white"
          title="Remove"
          aria-label="Remove selected photo"
        >
          <X :size="14" />
        </button>
      </div>

      <div class="flex items-center gap-2 text-xs" style="color: #6b7294">
        <span class="truncate">{{ file.name }}</span>
        <span aria-hidden="true">•</span>
        <span class="shrink-0">
          {{ (file.size / 1024 / 1024).toFixed(2) }} MB
        </span>
      </div>

      <div class="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          @click="retrySubmit"
          :disabled="submitting"
          class="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          style="
            background: #031a60;
            color: white;
            box-shadow: 0 6px 18px rgba(3, 26, 96, 0.22);
          "
        >
          <Loader2 v-if="submitting" :size="15" class="animate-spin" />
          <ShieldCheck v-else :size="15" />
          {{ submitting ? "Scanning document…" : "Scan document" }}
        </button>
        <button
          type="button"
          @click="clearPreview"
          :disabled="submitting"
          class="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-60 transition-colors"
          style="background: white; border: 1px solid #e2e5ed; color: #031a60"
        >
          <RotateCcw :size="14" />
          Choose different photo
        </button>
      </div>
    </div>

    <div
      v-else
      @drop="onDrop"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      class="rounded-xl border-2 border-dashed p-8 text-center transition-colors"
      :style="
        dragActive
          ? 'border-color:#031a60; background:rgba(3,26,96,0.04)'
          : 'border-color:#d8dce8; background:#fafbff'
      "
    >
      <div
        class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
        style="background: rgba(3, 26, 96, 0.08)"
      >
        <Upload :size="22" color="#031a60" />
      </div>
      <p class="text-sm font-semibold mb-1" style="color: #031a60">
        Drop your ID photo here
      </p>
      <p class="text-xs mb-5" style="color: #6b7294">
        or choose one of the options below
      </p>

      <div class="flex flex-col sm:flex-row gap-2 justify-center">
        <button
          type="button"
          @click="openCamera"
          class="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold cursor-pointer transition-colors"
          style="background: #031a60; color: white"
        >
          <Camera :size="15" />
          Take photo
        </button>
        <button
          type="button"
          @click="fileInput?.click()"
          class="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold cursor-pointer transition-colors"
          style="background: white; border: 1px solid #e2e5ed; color: #031a60"
        >
          <ImageIcon :size="15" />
          Browse files
        </button>
      </div>

      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif"
        class="hidden"
        @change="onFileChange"
      />
      <input
        ref="cameraInput"
        type="file"
        accept="image/*"
        capture="environment"
        class="hidden"
        @change="onFileChange"
      />
    </div>
  </section>

  <CameraModal
    :open="cameraOpen"
    @close="cameraOpen = false"
    @capture="onCameraCapture"
    @fallback-to-upload="onCameraFallback"
  />
</template>
