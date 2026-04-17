<script setup lang="ts">
import { computed, watch } from 'vue'
import { ChevronDown, CheckCircle2, XCircle } from 'lucide-vue-next'
import type { CountryCode } from 'libphonenumber-js'
import { usePhoneField } from '../composables/usePhoneField'
import FieldMsg from './FieldMsg.vue'

const props = withDefaults(
  defineProps<{
    modelValue: string | undefined
    label?: string
    initialCountry?: CountryCode
    schemaError?: string
    submitCount?: number
  }>(),
  { label: 'Phone number', initialCountry: 'RW', submitCount: 0 },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const {
  selectedCountry,
  phoneLocal,
  dropdownOpen,
  phoneSearch,
  phoneFieldRef,
  selectedCountryData,
  filteredCountries,
  examplePlaceholder,
  phoneValidation,
  phoneE164,
  selectCountry,
  prefillFromE164,
} = usePhoneField({ initialCountry: props.initialCountry })

// External → internal: prefill when parent sets an E.164 we don't already hold.
watch(
  () => props.modelValue,
  (v) => {
    if (v && v !== phoneE164.value) prefillFromE164(v)
  },
  { immediate: true },
)

// Internal → external: emit only on real change to avoid echo loops.
watch(phoneE164, (v) => {
  if (v !== props.modelValue) emit('update:modelValue', v)
})

const hasError = computed(() => {
  if (phoneLocal.value && phoneValidation.value.valid === false) return true
  if ((phoneLocal.value || props.submitCount > 0) && props.schemaError) return true
  return false
})

const msg = computed<{ show: boolean; tone: 'error' | 'success'; text: string }>(() => {
  if (phoneLocal.value && phoneValidation.value.valid === false)
    return { show: true, tone: 'error', text: phoneValidation.value.message }
  if ((phoneLocal.value || props.submitCount > 0) && props.schemaError)
    return { show: true, tone: 'error', text: props.schemaError }
  if (phoneLocal.value && phoneValidation.value.valid === true)
    return { show: true, tone: 'success', text: '✓ ' + phoneValidation.value.message }
  return { show: false, tone: 'error', text: '' }
})
</script>

<template>
  <div>
    <label class="block text-xs font-semibold mb-1.5" style="color:#1a2847">{{ label }}</label>
    <div class="relative" ref="phoneFieldRef">
      <div
        class="flex rounded-xl overflow-hidden transition-all"
        :style="
          hasError
            ? 'background:rgba(239,68,68,0.06);box-shadow:inset 0 0 0 1px rgba(239,68,68,0.45)'
            : 'background:#f0f2f7'
        "
      >
        <button
          type="button"
          @click.stop="dropdownOpen = !dropdownOpen"
          class="flex items-center gap-1.5 pl-3 pr-2 py-3 shrink-0 cursor-pointer transition-colors hover:bg-black/5"
          :style="
            hasError
              ? 'border-right:1px solid rgba(239,68,68,0.3)'
              : 'border-right:1px solid #dce1e9'
          "
        >
          <span class="text-lg leading-none">{{ selectedCountryData.flag }}</span>
          <span class="text-xs font-semibold" style="color:#031a60">{{ selectedCountryData.dialCode }}</span>
          <ChevronDown
            :size="12"
            class="transition-transform duration-200"
            :class="dropdownOpen ? 'rotate-180' : ''"
            style="color:#a8adc1"
          />
        </button>

        <input
          v-model="phoneLocal"
          type="tel"
          :placeholder="examplePlaceholder || 'Phone number'"
          class="flex-1 px-3 py-3 text-sm bg-transparent outline-none min-w-0"
          style="color:#031a60"
        />

        <div v-if="phoneLocal" class="flex items-center pr-3 shrink-0">
          <CheckCircle2 v-if="phoneValidation.valid === true" :size="15" style="color:#299f4d" />
          <XCircle v-if="phoneValidation.valid === false" :size="15" style="color:#ef4444" />
        </div>
      </div>

      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 translate-y-[-6px]"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-[-6px]"
      >
        <div
          v-if="dropdownOpen"
          class="absolute left-0 right-0 mt-1.5 rounded-xl border z-50 flex flex-col"
          style="top:100%;background:white;border-color:#e2e5ed;box-shadow:0 12px 32px rgba(3,26,96,0.14);max-height:260px"
        >
          <div class="px-3 pt-2.5 pb-2 shrink-0" style="border-bottom:1px solid #f0f2f7">
            <input
              v-model="phoneSearch"
              type="text"
              placeholder="Search country or code…"
              class="w-full text-xs py-1.5 pl-2 pr-2 rounded-lg outline-none"
              style="background:#f0f2f7;color:#031a60"
              @click.stop
            />
          </div>
          <div class="overflow-y-auto flex-1">
            <template v-if="filteredCountries.length">
              <button
                v-for="c in filteredCountries"
                :key="c.code"
                type="button"
                @click.stop="selectCountry(c)"
                class="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm cursor-pointer transition-colors hover:bg-[#f0f2f7]"
                :style="
                  c.code === selectedCountry
                    ? 'background:#e8f5ee;color:#031a60'
                    : 'color:#1a2847'
                "
              >
                <span class="text-base leading-none shrink-0">{{ c.flag }}</span>
                <span class="flex-1 truncate text-xs">{{ c.name }}</span>
                <span class="text-xs font-medium shrink-0" style="color:#a8adc1">{{ c.dialCode }}</span>
                <CheckCircle2 v-if="c.code === selectedCountry" :size="12" style="color:#299f4d" class="shrink-0" />
              </button>
            </template>
            <p v-else class="text-center text-xs py-4" style="color:#a8adc1">No countries found</p>
          </div>
        </div>
      </Transition>
    </div>

    <FieldMsg :show="msg.show" :tone="msg.tone" class="mt-1">{{ msg.text }}</FieldMsg>
  </div>
</template>
