<script setup lang="ts">
import { computed, ref } from 'vue'
import { Eye, EyeOff, IdCard } from 'lucide-vue-next'
import type { IDVerification } from '../../../../services/idVerification.service'
import MaskedDocumentImage from './MaskedDocumentImage.vue'

const props = defineProps<{
  record: IDVerification
}>()

const showIdNumber = ref(false)

const maskedIdNumber = computed(() => {
  const raw = props.record.id_number ?? ''
  if (!raw) return '—'
  if (showIdNumber.value) return formatIdNumber(raw)
  if (raw.length <= 4) return raw
  return `${'•'.repeat(Math.max(0, raw.length - 4))}${raw.slice(-4)}`
})

function formatIdNumber(raw: string) {
  // Rwandan NID is 16 digits — group as 1 4 1 7 2 1 for readability.
  if (raw.length !== 16) return raw
  return `${raw[0]} ${raw.slice(1, 5)} ${raw[5]} ${raw.slice(6, 13)} ${raw.slice(13, 15)} ${raw[15]}`
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return '—'
  }
}
</script>

<template>
  <section
    class="rounded-2xl bg-white border overflow-hidden"
    style="border-color: #e8eaf0"
  >
    <header
      class="px-6 py-4 border-b flex items-center justify-between gap-3"
      style="border-color: #f0f2f7"
    >
      <div>
        <h2 class="text-sm font-bold" style="color: #031a60">
          Extracted details
        </h2>
        <p class="text-xs mt-0.5" style="color: #a8adc1">
          Read from your {{ record.type_display }}
        </p>
      </div>
      <span
        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
        style="background: rgba(3, 26, 96, 0.06); color: #031a60"
      >
        <IdCard :size="11" />
        {{ record.type_display }}
      </span>
    </header>

    <div class="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
      <MaskedDocumentImage :src="record.document_image_url" />

      <dl class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div class="rounded-xl p-3.5 sm:col-span-2" style="background: #fafbff">
          <dt
            class="text-[10px] font-semibold uppercase tracking-widest mb-1"
            style="color: #a8adc1"
          >
            Full name
          </dt>
          <dd class="text-sm font-semibold" style="color: #031a60">
            {{ record.full_name || '—' }}
          </dd>
        </div>

        <div class="rounded-xl p-3.5 sm:col-span-2" style="background: #fafbff">
          <dt
            class="text-[10px] font-semibold uppercase tracking-widest mb-1"
            style="color: #a8adc1"
          >
            ID number
          </dt>
          <dd class="flex items-center justify-between gap-2">
            <span class="text-sm font-mono tracking-wide" style="color: #031a60">
              {{ maskedIdNumber }}
            </span>
            <button
              type="button"
              @click="showIdNumber = !showIdNumber"
              class="p-1 rounded-md cursor-pointer hover:bg-white"
              :title="showIdNumber ? 'Hide ID number' : 'Show ID number'"
              :aria-label="showIdNumber ? 'Hide ID number' : 'Show ID number'"
              :aria-pressed="showIdNumber"
              style="color: #6b7294"
            >
              <Eye v-if="!showIdNumber" :size="14" />
              <EyeOff v-else :size="14" />
            </button>
          </dd>
        </div>

        <div class="rounded-xl p-3.5" style="background: #fafbff">
          <dt
            class="text-[10px] font-semibold uppercase tracking-widest mb-1"
            style="color: #a8adc1"
          >
            Date of birth
          </dt>
          <dd class="text-sm font-medium" style="color: #031a60">
            {{ formatDate(record.date_of_birth) }}
          </dd>
        </div>

        <div class="rounded-xl p-3.5" style="background: #fafbff">
          <dt
            class="text-[10px] font-semibold uppercase tracking-widest mb-1"
            style="color: #a8adc1"
          >
            Sex
          </dt>
          <dd class="text-sm font-medium" style="color: #031a60">
            {{ record.sex_display || record.sex || '—' }}
          </dd>
        </div>

        <div class="rounded-xl p-3.5" style="background: #fafbff">
          <dt
            class="text-[10px] font-semibold uppercase tracking-widest mb-1"
            style="color: #a8adc1"
          >
            Place of issue
          </dt>
          <dd class="text-sm font-medium" style="color: #031a60">
            {{ record.place_of_issue || '—' }}
          </dd>
        </div>

        <div class="rounded-xl p-3.5" style="background: #fafbff">
          <dt
            class="text-[10px] font-semibold uppercase tracking-widest mb-1"
            style="color: #a8adc1"
          >
            Submitted
          </dt>
          <dd class="text-sm font-medium" style="color: #031a60">
            {{ formatDate(record.created_at) }}
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>
