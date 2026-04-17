import { computed, onMounted, onUnmounted, ref, type Ref } from 'vue'
import {
  getCountries,
  getCountryCallingCode,
  getExampleNumber,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  type CountryCode,
} from 'libphonenumber-js'
import examplesData from 'libphonenumber-js/examples.mobile.json'

export interface PhoneCountry {
  code: CountryCode
  name: string
  dialCode: string
  flag: string
}

function flagEmoji(code: string): string {
  return [...code.toUpperCase()]
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join('')
}

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })

const COUNTRY_LIST: PhoneCountry[] = getCountries()
  .map((code) => ({
    code,
    name: regionNames.of(code) ?? code,
    dialCode: '+' + getCountryCallingCode(code),
    flag: flagEmoji(code),
  }))
  .sort((a, b) => a.name.localeCompare(b.name))

export interface UsePhoneFieldOptions {
  initialCountry?: CountryCode
  initialLocal?: string
}

/**
 * Encapsulates country-code picker + local-number input + E.164 resolution.
 * Consumers bind `phoneLocal`, `selectedCountry`, `dropdownOpen`, `phoneSearch`
 * to their markup, and read `phoneE164` / `phoneValid` for submission.
 */
export function usePhoneField(options: UsePhoneFieldOptions = {}) {
  const selectedCountry = ref<CountryCode>(options.initialCountry ?? 'RW')
  const phoneLocal = ref<string>(options.initialLocal ?? '')
  const dropdownOpen = ref(false)
  const phoneSearch = ref('')
  const phoneFieldRef = ref<HTMLElement | null>(null)

  const countryList: PhoneCountry[] = COUNTRY_LIST

  const selectedCountryData = computed<PhoneCountry>(
    () => countryList.find((c) => c.code === selectedCountry.value) ?? countryList[0],
  )

  const filteredCountries = computed<PhoneCountry[]>(() => {
    const q = phoneSearch.value.toLowerCase().trim()
    if (!q) return countryList
    return countryList.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.includes(q) ||
        c.code.toLowerCase().includes(q),
    )
  })

  const examplePlaceholder = computed<string>(() => {
    try {
      const ex = getExampleNumber(selectedCountry.value, examplesData as never)
      return ex ? ex.formatNational() : ''
    } catch {
      return ''
    }
  })

  const phoneValidation = computed<{ valid: boolean | null; message: string }>(() => {
    if (!phoneLocal.value) return { valid: null, message: '' }
    try {
      const ok = isValidPhoneNumber(phoneLocal.value, selectedCountry.value)
      return ok
        ? { valid: true, message: 'Looks good!' }
        : { valid: false, message: `Invalid number for ${selectedCountryData.value.name}` }
    } catch {
      return { valid: false, message: 'Invalid phone number format' }
    }
  })

  const phoneE164 = computed<string>(() => {
    if (!phoneLocal.value) return ''
    const parsed = parsePhoneNumberFromString(phoneLocal.value, selectedCountry.value)
    return parsed?.isValid() ? parsed.number : ''
  })

  function selectCountry(c: PhoneCountry) {
    selectedCountry.value = c.code
    dropdownOpen.value = false
    phoneSearch.value = ''
    phoneLocal.value = ''
  }

  function onDocClick(e: MouseEvent) {
    if (phoneFieldRef.value && !phoneFieldRef.value.contains(e.target as Node)) {
      dropdownOpen.value = false
    }
  }

  onMounted(() => document.addEventListener('click', onDocClick))
  onUnmounted(() => document.removeEventListener('click', onDocClick))

  /** Seed the field from a pre-existing E.164 string (e.g. query param prefill). */
  function prefillFromE164(e164: string) {
    if (!e164) return
    const parsed = parsePhoneNumberFromString(e164)
    if (!parsed) return
    selectedCountry.value = parsed.country ?? selectedCountry.value
    phoneLocal.value = parsed.formatNational()
  }

  return {
    countryList,
    selectedCountry,
    phoneLocal,
    dropdownOpen,
    phoneSearch,
    phoneFieldRef: phoneFieldRef as Ref<HTMLElement | null>,
    selectedCountryData,
    filteredCountries,
    examplePlaceholder,
    phoneValidation,
    phoneE164,
    selectCountry,
    prefillFromE164,
  }
}
