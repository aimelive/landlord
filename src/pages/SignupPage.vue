<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSeo } from '../composables/useSeo'

useSeo({
  title: 'Create Account',
  description: 'Create your free LandLord tenant account and start tracking rent payments, coverage months, and your rental credit score.',
  canonical: 'https://landlord.aimelive.com/signup',
})
import {
  Eye, EyeOff, Mail, Lock, User, ArrowRight,
  AlertCircle, Building2, UserCheck, ChevronDown,
  CheckCircle2, XCircle,
} from 'lucide-vue-next'
import {
  isValidPhoneNumber,
  getCountries,
  getCountryCallingCode,
  getExampleNumber,
} from 'libphonenumber-js'
import examplesData from 'libphonenumber-js/examples.mobile.json'

const router = useRouter()

// ── Country list ──────────────────────────────────────────
const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })

function flagEmoji(code: string) {
  return [...code.toUpperCase()].map(c =>
    String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)
  ).join('')
}

const countryList = getCountries()
  .map(code => ({
    code,
    name: regionNames.of(code) ?? code,
    dialCode: '+' + getCountryCallingCode(code),
    flag: flagEmoji(code),
  }))
  .sort((a, b) => a.name.localeCompare(b.name))

// ── Role ─────────────────────────────────────────────────
type Role = 'landlord' | 'tenant'
const role = ref<Role>('landlord')
function setRole(r: Role) { role.value = r; error.value = '' }

// ── Form fields ───────────────────────────────────────────
const fullName  = ref('')
const email     = ref('')
const password  = ref('')
const confirm   = ref('')
const showPass  = ref(false)
const showConf  = ref(false)
const agreed    = ref(false)
const loading   = ref(false)
const error     = ref('')

// ── Phone field state ─────────────────────────────────────
const selectedCountry = ref('RW')   // default Rwanda
const phoneNumber     = ref('')
const dropdownOpen    = ref(false)
const phoneSearch     = ref('')
const phoneFieldRef   = ref<HTMLElement | null>(null)

const selectedCountryData = computed(() =>
  countryList.find(c => c.code === selectedCountry.value) ?? countryList[0]
)

const filteredCountries = computed(() => {
  const q = phoneSearch.value.toLowerCase().trim()
  if (!q) return countryList
  return countryList.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.dialCode.includes(q) ||
    c.code.toLowerCase().includes(q)
  )
})

const examplePlaceholder = computed(() => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ex = getExampleNumber(selectedCountry.value as any, examplesData as any)
    return ex ? ex.formatNational() : ''
  } catch { return '' }
})

const phoneValidation = computed(() => {
  if (!phoneNumber.value) return { valid: null as boolean | null, message: '' }
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ok = isValidPhoneNumber(phoneNumber.value, selectedCountry.value as any)
    return ok
      ? { valid: true,  message: 'Looks good!' }
      : { valid: false, message: `Invalid number for ${selectedCountryData.value.name}` }
  } catch {
    return { valid: false, message: 'Invalid phone number format' }
  }
})

function selectCountry(country: typeof countryList[0]) {
  selectedCountry.value = country.code
  dropdownOpen.value = false
  phoneSearch.value  = ''
  phoneNumber.value  = ''
}

function onDocClick(e: MouseEvent) {
  if (phoneFieldRef.value && !phoneFieldRef.value.contains(e.target as Node)) {
    dropdownOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))

// ── Password strength ─────────────────────────────────────
function strengthLevel(pw: string) {
  if (!pw) return { level: 0, label: '', color: '#dce1e9' }
  if (pw.length < 6)  return { level: 1, label: 'Weak',   color: '#ef4444' }
  if (pw.length < 10) return { level: 2, label: 'Fair',   color: '#f59e0b' }
  return                     { level: 3, label: 'Strong', color: '#299f4d' }
}

// ── Submit ────────────────────────────────────────────────
async function handleSubmit() {
  error.value = ''
  if (!fullName.value || !email.value || !phoneNumber.value || !password.value || !confirm.value) {
    error.value = 'Please fill in all fields.'
    return
  }
  if (phoneValidation.value.valid !== true) {
    error.value = `Please enter a valid ${selectedCountryData.value.name} phone number.`
    return
  }
  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters.'
    return
  }
  if (password.value !== confirm.value) {
    error.value = 'Passwords do not match.'
    return
  }
  if (!agreed.value) {
    error.value = 'Please accept the terms to continue.'
    return
  }
  loading.value = true
  await new Promise(r => setTimeout(r, 900))
  loading.value = false
  router.push('/dashboard')
}

// ── Left panel copy ───────────────────────────────────────
const panel = computed(() =>
  role.value === 'landlord'
    ? {
        heading: 'Manage every\nproperty with',
        accent: 'full clarity.',
        sub: 'Track every payment, send automated reminders, and know exactly which months each tenant has covered.',
        bullets: [
          'Dashboard for all your properties & tenants',
          'Automated rent reminders — stop chasing',
          'Verify tenant credit score before signing',
        ],
        btnBg: '#031a60',
        btnLabel: 'Join as Landlord',
      }
    : {
        heading: 'Build your\nrental history.',
        accent: 'Own your score.',
        sub: 'Every on-time payment builds a credit score that follows you everywhere. Be the tenant every landlord wants.',
        bullets: [
          "Know exactly which months you've paid for",
          'Build a portable credit score over time',
          'Communicate with your landlord transparently',
        ],
        btnBg: '#299f4d',
        btnLabel: 'Join as Tenant',
      }
)
</script>

<template>
  <!-- Page background -->
  <div class="min-h-screen flex flex-col items-center justify-start pt-6 pb-10 px-4 sm:justify-center sm:py-10 sm:px-6 lg:px-10 font-sans"
       style="background: linear-gradient(135deg, #dde1ef 0%, #e8eaf4 50%, #d5d9ea 100%)">

    <!-- SVG clip-path definition -->
    <svg width="0" height="0" style="position:absolute;overflow:visible" aria-hidden="true">
      <defs>
        <clipPath id="signup-d-clip" clipPathUnits="objectBoundingBox">
          <path d="M 0,0 L 0.72,0 C 1.0,0.1 1.0,0.9 0.72,1 L 0,1 Z"/>
        </clipPath>
      </defs>
    </svg>

    <!-- ══ Auth card ══ -->
    <div class="w-full max-w-5xl rounded-4xl overflow-hidden flex flex-col lg:flex-row"
         style="box-shadow: 0 48px 120px rgba(3,26,96,0.2), 0 12px 40px rgba(3,26,96,0.12); background: white">

      <!-- ── Left — Branding (mobile: compact top strip, desktop: smooth D-shaped panel) ── -->
      <div class="panel-left lg:w-[50%] hidden lg:flex flex-col justify-between
                  px-6 sm:px-10 lg:pl-12 lg:pr-24
                  py-5 lg:py-12
                  lg:h-auto
                  relative overflow-hidden"
           style="background: #031a60">

        <!-- Mobile wave bottom -->
        <svg class="lg:hidden absolute bottom-0 left-0 w-full pointer-events-none"
             style="height:40px" preserveAspectRatio="none" viewBox="0 0 100 20">
          <path d="M0,0 L100,0 L100,10 Q50,20 0,10 Z" fill="white"/>
        </svg>

        <!-- Desktop mesh orbs -->
        <div class="hidden lg:block absolute pointer-events-none"
             style="top:-60px;right:20px;width:280px;height:280px;border-radius:50%;
                    background:radial-gradient(circle,rgba(41,159,77,0.35) 0%,transparent 70%);filter:blur(55px)"></div>
        <div class="hidden lg:block absolute pointer-events-none"
             style="bottom:-50px;left:-20px;width:240px;height:240px;border-radius:50%;
                    background:radial-gradient(circle,rgba(41,159,77,0.18) 0%,transparent 70%);filter:blur(75px)"></div>
        <div class="hidden lg:block absolute pointer-events-none"
             style="top:50%;right:0;width:300px;height:300px;border-radius:50%;
                    background:radial-gradient(circle,rgba(91,138,245,0.2) 0%,transparent 70%);
                    filter:blur(65px);transform:translateY(-50%)"></div>

        <!-- Logo (always visible) -->
        <span class="logo-capsule self-start relative z-10">
          <img src="/logo.png" alt="LandLord" class="h-7 w-auto" />
        </span>

        <!-- Mobile only: compact portal label -->
        <div class="lg:hidden relative z-10 mt-2">
          <p class="text-xs font-semibold uppercase tracking-widest" style="color:rgba(255,255,255,0.45)">
            {{ role === 'landlord' ? 'Landlord Portal' : 'Tenant Portal' }}
          </p>
          <p class="text-sm font-bold whitespace-pre-line" style="color:#4fd87c">
            {{ panel.accent }}
          </p>
        </div>

        <!-- Desktop: full copy -->
        <Transition name="panel" mode="out-in">
          <div :key="role" class="hidden lg:block relative z-10">
            <p class="text-xs font-semibold uppercase tracking-widest mb-3" style="color:rgba(255,255,255,0.45)">
              {{ role === 'landlord' ? 'Landlord Portal' : 'Tenant Portal' }}
            </p>
            <h2 class="text-4xl xl:text-5xl font-bold text-white leading-tight mb-2 whitespace-pre-line">
              {{ panel.heading }}
            </h2>
            <p class="text-lg font-semibold mb-5 whitespace-pre-line" style="color:#4fd87c">
              {{ panel.accent }}
            </p>
            <p class="text-sm leading-relaxed mb-6" style="color:#a8adc1;max-width:210px">
              {{ panel.sub }}
            </p>
            <div class="flex flex-col gap-3">
              <div v-for="item in panel.bullets" :key="item"
                   class="flex items-center gap-3 text-sm" style="color:#dce1e9">
                <span class="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style="background:rgba(41,159,77,0.25)">
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="#4fd87c" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                {{ item }}
              </div>
            </div>
          </div>
        </Transition>

        <p class="hidden lg:block text-xs relative z-10" style="color:#6b7294">
          &copy; {{ new Date().getFullYear() }} LandLord · Built for clarity.
        </p>
      </div>

      <!-- ── Right — Form ── -->
      <div class="flex-1 flex items-center justify-center px-6 sm:px-10 xl:px-14 py-10 lg:py-12 relative bg-white">

        <!-- Decorative ring top-right -->
        <div class="absolute pointer-events-none"
             style="top:-70px;right:-70px;width:240px;height:240px;border-radius:50%;
                    border:1.5px solid rgba(3,26,96,0.08)"></div>
        <div class="absolute pointer-events-none"
             style="top:-100px;right:-100px;width:320px;height:320px;border-radius:50%;
                    background:radial-gradient(circle at 40% 40%,rgba(3,26,96,0.06) 0%,transparent 70%);filter:blur(4px)"></div>
        <div class="absolute pointer-events-none"
             style="bottom:-50px;left:-50px;width:180px;height:180px;border-radius:50%;
                    background:radial-gradient(circle,rgba(41,159,77,0.08) 0%,transparent 70%);filter:blur(30px)"></div>

        <div class="w-full max-w-sm relative z-10"
             v-motion :initial="{ opacity:0, y:24 }" :enter="{ opacity:1, y:0, transition:{ duration:500 } }">

          <h1 class="text-2xl font-bold mb-1" style="color:#031a60">Create your account</h1>
          <p class="text-sm mb-5" style="color:#a8adc1">
            Already have one?
            <router-link to="/login" class="font-semibold hover:underline" style="color:#299f4d">Log in</router-link>
          </p>

          <!-- Role toggle -->
          <div class="flex rounded-xl p-1 mb-5" style="background:#f0f2f7">
            <button v-for="r in (['landlord','tenant'] as const)" :key="r" type="button"
                    @click="setRole(r)"
                    class="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg
                           text-sm font-semibold transition-all duration-200 cursor-pointer"
                    :style="role===r
                      ? 'background:white;color:#031a60;box-shadow:0 1px 8px rgba(3,26,96,0.1)'
                      : 'color:#a8adc1'">
              <component :is="r==='landlord' ? Building2 : UserCheck" :size="14" />
              {{ r === 'landlord' ? 'Landlord' : 'Tenant' }}
            </button>
          </div>

          <!-- Error -->
          <div v-if="error"
               class="flex items-center gap-2 text-sm px-3 py-2.5 rounded-xl mb-4 border"
               style="background:rgba(220,38,38,0.05);border-color:rgba(220,38,38,0.2);color:#dc2626">
            <AlertCircle :size="15" class="shrink-0" />
            {{ error }}
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-3.5" novalidate>

            <!-- Full name -->
            <div>
              <label class="block text-xs font-semibold mb-1.5" style="color:#1a2847">
                {{ role === 'landlord' ? 'Full name / Company name' : 'Full name' }}
              </label>
              <div class="relative">
                <User :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style="color:#a8adc1" />
                <input v-model="fullName" type="text" autocomplete="name"
                       :placeholder="role==='landlord' ? 'Jane Doe / Kigali Properties Ltd' : 'Jane Doe'"
                       required
                       class="w-full pl-9 pr-4 py-3 text-sm rounded-xl border-0 outline-none transition-all focus:ring-2"
                       style="background:#f0f2f7;color:#031a60;--tw-ring-color:rgba(3,26,96,0.15)" />
              </div>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-xs font-semibold mb-1.5" style="color:#1a2847">Email address</label>
              <div class="relative">
                <Mail :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style="color:#a8adc1" />
                <input v-model="email" type="email" autocomplete="email" placeholder="you@example.com" required
                       class="w-full pl-9 pr-4 py-3 text-sm rounded-xl border-0 outline-none transition-all focus:ring-2"
                       style="background:#f0f2f7;color:#031a60;--tw-ring-color:rgba(3,26,96,0.15)" />
              </div>
            </div>

            <!-- ── Phone number ── -->
            <div>
              <label class="block text-xs font-semibold mb-1.5" style="color:#1a2847">Phone number</label>

              <!-- Combined field wrapper -->
              <div class="relative" ref="phoneFieldRef">
                <div class="flex rounded-xl overflow-hidden" style="background:#f0f2f7">

                  <!-- Country selector button -->
                  <button type="button"
                          @click.stop="dropdownOpen = !dropdownOpen"
                          class="flex items-center gap-1.5 pl-3 pr-2 py-3 shrink-0 cursor-pointer
                                 transition-colors hover:bg-black/5"
                          style="border-right:1px solid #dce1e9">
                    <span class="text-lg leading-none">{{ selectedCountryData.flag }}</span>
                    <span class="text-xs font-semibold" style="color:#031a60">{{ selectedCountryData.dialCode }}</span>
                    <ChevronDown :size="12" class="transition-transform duration-200"
                                 :class="dropdownOpen ? 'rotate-180' : ''"
                                 style="color:#a8adc1" />
                  </button>

                  <!-- Phone input -->
                  <input v-model="phoneNumber" type="tel"
                         :placeholder="examplePlaceholder || 'Phone number'"
                         class="flex-1 px-3 py-3 text-sm bg-transparent outline-none min-w-0"
                         style="color:#031a60" />

                  <!-- Validation indicator -->
                  <div v-if="phoneNumber" class="flex items-center pr-3 shrink-0">
                    <CheckCircle2 v-if="phoneValidation.valid === true"  :size="15" style="color:#299f4d" />
                    <XCircle      v-if="phoneValidation.valid === false" :size="15" style="color:#ef4444" />
                  </div>
                </div>

                <!-- ── Country dropdown ── -->
                <Transition
                  enter-active-class="transition duration-150 ease-out"
                  enter-from-class="opacity-0 translate-y-[-6px]"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition duration-100 ease-in"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 translate-y-[-6px]"
                >
                  <div v-if="dropdownOpen"
                       class="absolute left-0 right-0 mt-1.5 rounded-xl border z-50 flex flex-col"
                       style="top:100%;background:white;border-color:#e2e5ed;
                              box-shadow:0 12px 32px rgba(3,26,96,0.14);max-height:260px">

                    <!-- Search -->
                    <div class="px-3 pt-2.5 pb-2 shrink-0" style="border-bottom:1px solid #f0f2f7">
                      <div class="relative">
                        <input v-model="phoneSearch" type="text"
                               placeholder="Search country or code…"
                               class="w-full text-xs py-1.5 pl-2 pr-2 rounded-lg outline-none"
                               style="background:#f0f2f7;color:#031a60"
                               @click.stop />
                      </div>
                    </div>

                    <!-- Country list -->
                    <div class="overflow-y-auto flex-1">
                      <template v-if="filteredCountries.length">
                        <button v-for="c in filteredCountries" :key="c.code"
                                type="button"
                                @click.stop="selectCountry(c)"
                                class="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm
                                       cursor-pointer transition-colors hover:bg-[#f0f2f7]"
                                :style="c.code===selectedCountry
                                  ? 'background:#e8f5ee;color:#031a60'
                                  : 'color:#1a2847'">
                          <span class="text-base leading-none shrink-0">{{ c.flag }}</span>
                          <span class="flex-1 truncate text-xs">{{ c.name }}</span>
                          <span class="text-xs font-medium shrink-0" style="color:#a8adc1">{{ c.dialCode }}</span>
                          <CheckCircle2 v-if="c.code===selectedCountry" :size="12" style="color:#299f4d" class="shrink-0" />
                        </button>
                      </template>
                      <p v-else class="text-center text-xs py-4" style="color:#a8adc1">No countries found</p>
                    </div>
                  </div>
                </Transition>
              </div>

              <!-- Validation message -->
              <p v-if="phoneNumber && phoneValidation.valid === false"
                 class="text-xs mt-1" style="color:#ef4444">
                {{ phoneValidation.message }}
              </p>
              <p v-if="phoneNumber && phoneValidation.valid === true"
                 class="text-xs mt-1" style="color:#299f4d">
                ✓ {{ phoneValidation.message }}
              </p>
            </div>

            <!-- Password -->
            <div>
              <label class="block text-xs font-semibold mb-1.5" style="color:#1a2847">Password</label>
              <div class="relative">
                <Lock :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style="color:#a8adc1" />
                <input v-model="password" :type="showPass ? 'text' : 'password'"
                       autocomplete="new-password" placeholder="Min. 8 characters" required
                       class="w-full pl-9 pr-10 py-3 text-sm rounded-xl border-0 outline-none transition-all focus:ring-2"
                       style="background:#f0f2f7;color:#031a60;--tw-ring-color:rgba(3,26,96,0.15)" />
                <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                        @click="showPass = !showPass" :aria-label="showPass ? 'Hide' : 'Show'">
                  <component :is="showPass ? EyeOff : Eye" :size="15" style="color:#a8adc1" />
                </button>
              </div>
              <div v-if="password" class="mt-1.5 flex items-center gap-2">
                <div class="flex gap-1 flex-1">
                  <div v-for="n in 3" :key="n"
                       class="h-1 flex-1 rounded-full transition-all duration-300"
                       :style="n<=strengthLevel(password).level
                         ? `background:${strengthLevel(password).color}`
                         : 'background:#dce1e9'"></div>
                </div>
                <span class="text-xs font-medium" :style="`color:${strengthLevel(password).color}`">
                  {{ strengthLevel(password).label }}
                </span>
              </div>
            </div>

            <!-- Confirm password -->
            <div>
              <label class="block text-xs font-semibold mb-1.5" style="color:#1a2847">Confirm password</label>
              <div class="relative">
                <Lock :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style="color:#a8adc1" />
                <input v-model="confirm" :type="showConf ? 'text' : 'password'"
                       autocomplete="new-password" placeholder="Repeat your password" required
                       class="w-full pl-9 pr-10 py-3 text-sm rounded-xl border-0 outline-none transition-all focus:ring-2"
                       :style="`background:${confirm&&confirm!==password?'rgba(220,38,38,0.06)':'#f0f2f7'};color:#031a60;--tw-ring-color:rgba(3,26,96,0.15)`" />
                <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                        @click="showConf = !showConf" :aria-label="showConf ? 'Hide' : 'Show'">
                  <component :is="showConf ? EyeOff : Eye" :size="15" style="color:#a8adc1" />
                </button>
              </div>
              <p v-if="confirm&&confirm!==password" class="text-xs mt-1" style="color:#ef4444">
                Passwords don't match
              </p>
            </div>

            <!-- Terms -->
            <label class="flex items-start gap-2.5 cursor-pointer select-none">
              <input v-model="agreed" type="checkbox" class="mt-0.5 w-4 h-4 rounded cursor-pointer shrink-0" />
              <span class="text-xs leading-relaxed" style="color:#a8adc1">
                I agree to the
                <button type="button" class="font-semibold hover:underline" style="color:#031a60">Terms of Service</button>
                and
                <button type="button" class="font-semibold hover:underline" style="color:#031a60">Privacy Policy</button>
              </span>
            </label>

            <!-- Submit -->
            <button type="submit" :disabled="loading"
                    class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                           text-sm font-semibold text-white transition-all duration-200
                           hover:opacity-90 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                    :style="`background:${panel.btnBg}`">
              <svg v-if="loading" class="animate-spin shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="white" stroke-width="3" stroke-linecap="round"/>
              </svg>
              <span>{{ loading ? 'Creating account…' : panel.btnLabel }}</span>
              <ArrowRight v-if="!loading" :size="15" />
            </button>

          </form>

          <p class="text-center text-xs mt-5" style="color:#a8adc1">
            <router-link to="/" class="hover:underline" style="color:#a8adc1">← Back to homepage</router-link>
          </p>

        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  .panel-left {
    clip-path: url(#signup-d-clip);
  }
}
</style>
