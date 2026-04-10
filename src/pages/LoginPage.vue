<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSeo } from '../composables/useSeo'

useSeo({
  title: 'Sign In',
  description: 'Sign in to your LandLord tenant account to view your rent payment history and coverage timeline.',
  canonical: 'https://landlord.aimelive.com/login',
})
import {
  Eye, EyeOff, Mail, Phone, AtSign, Lock, ArrowRight,
  AlertCircle, Building2, UserCheck,
} from 'lucide-vue-next'

const router = useRouter()

type Role = 'landlord' | 'tenant'

const role       = ref<Role>('landlord')
const identifier = ref('')
const password   = ref('')
const showPass   = ref(false)
const remember   = ref(false)
const loading    = ref(false)
const error      = ref('')

function setRole(r: Role) {
  role.value = r
  error.value = ''
}

// Detect whether the user is typing an email or phone number
const identifierIcon = computed(() => {
  const v = identifier.value.trim()
  if (!v) return AtSign
  if (v.includes('@')) return Mail
  if (/^[+\d]/.test(v)) return Phone
  return AtSign
})

function isValidIdentifier(v: string) {
  const val = v.trim()
  if (!val) return false
  // Email check
  if (val.includes('@')) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
  // Phone check — at least 7 digits
  return val.replace(/\D/g, '').length >= 7
}

async function handleSubmit() {
  error.value = ''
  if (!identifier.value.trim() || !password.value) {
    error.value = 'Please fill in all fields.'
    return
  }
  if (!isValidIdentifier(identifier.value)) {
    error.value = 'Please enter a valid email address or phone number.'
    return
  }
  loading.value = true
  await new Promise(r => setTimeout(r, 900))
  loading.value = false
  router.push('/dashboard')
}

const panel = computed(() =>
  role.value === 'landlord'
    ? {
        heading: 'Welcome\nback.',
        accent: 'Your properties\nawait you.',
        sub: 'Manage rent, tenants and reminders — all in one clear dashboard.',
        btnBg: '#031a60',
        btnLabel: 'Sign in as Landlord',
      }
    : {
        heading: 'Welcome\nback.',
        accent: 'Your score is\nstill growing.',
        sub: 'See your coverage, track payments, and build your credit history.',
        btnBg: '#299f4d',
        btnLabel: 'Sign in as Tenant',
      }
)
</script>

<template>
  <!-- Page background -->
  <div class="min-h-screen flex flex-col items-center justify-start pt-6 pb-10 px-4 sm:justify-center sm:py-10 sm:px-6 lg:px-10 font-sans"
       style="background: linear-gradient(135deg, #dde1ef 0%, #e8eaf4 50%, #d5d9ea 100%)">

    <!-- SVG clip-path definition (smooth bezier D-curve, responsive via objectBoundingBox) -->
    <svg width="0" height="0" style="position:absolute;overflow:visible" aria-hidden="true">
      <defs>
        <clipPath id="login-d-clip" clipPathUnits="objectBoundingBox">
          <path d="M 0,0 L 0.72,0 C 1.0,0.1 1.0,0.9 0.72,1 L 0,1 Z"/>
        </clipPath>
      </defs>
    </svg>

    <!-- ══ Auth card ══ -->
    <div class="w-full max-w-5xl rounded-[2rem] overflow-hidden flex flex-col lg:flex-row"
         style="box-shadow: 0 48px 120px rgba(3,26,96,0.2), 0 12px 40px rgba(3,26,96,0.12); background: white">

      <!-- ── Left — Branding (mobile: compact top strip, desktop: smooth D-shaped panel) ── -->
      <div class="panel-left lg:w-[50%] hidden lg:flex flex-col justify-between
                  px-6 sm:px-10 lg:pl-12 lg:pr-24
                  py-5 lg:py-12
                  lg:h-auto
                  relative overflow-hidden"
           style="background: #031a60">

        <!-- Mobile only: wave at bottom -->
        <svg class="lg:hidden absolute bottom-0 left-0 w-full pointer-events-none"
             style="height:40px" preserveAspectRatio="none" viewBox="0 0 100 20">
          <path d="M0,0 L100,0 L100,10 Q50,20 0,10 Z" fill="white"/>
        </svg>

        <!-- Desktop mesh orbs -->
        <div class="hidden lg:block absolute pointer-events-none"
             style="top:-60px; right:20px; width:280px; height:280px; border-radius:50%;
                    background:radial-gradient(circle at 50% 50%, rgba(41,159,77,0.35) 0%, transparent 70%);
                    filter:blur(55px)"></div>
        <div class="hidden lg:block absolute pointer-events-none"
             style="bottom:-50px; left:-20px; width:240px; height:240px; border-radius:50%;
                    background:radial-gradient(circle, rgba(41,159,77,0.18) 0%, transparent 70%);
                    filter:blur(75px)"></div>
        <div class="hidden lg:block absolute pointer-events-none"
             style="top:50%; right:0; width:300px; height:300px; border-radius:50%;
                    background:radial-gradient(circle, rgba(91,138,245,0.2) 0%, transparent 70%);
                    filter:blur(65px); transform:translateY(-50%)"></div>

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
            <h2 class="text-4xl xl:text-5xl font-bold text-white leading-tight mb-3 whitespace-pre-line">
              {{ panel.heading }}
            </h2>
            <p class="text-lg font-semibold mb-4 whitespace-pre-line" style="color:#4fd87c">
              {{ panel.accent }}
            </p>
            <p class="text-sm leading-relaxed" style="color:#a8adc1; max-width:210px">
              {{ panel.sub }}
            </p>
          </div>
        </Transition>

        <p class="hidden lg:block text-xs relative z-10" style="color:#6b7294">
          &copy; {{ new Date().getFullYear() }} LandLord · Built for clarity.
        </p>
      </div>

      <!-- ── Right — Form ── -->
      <div class="flex-1 flex items-center justify-center px-6 sm:px-10 xl:px-14 py-10 lg:py-12 relative overflow-hidden bg-white">

        <!-- Decorative ring top-right -->
        <div class="absolute pointer-events-none"
             style="top:-70px; right:-70px; width:240px; height:240px; border-radius:50%;
                    border:1.5px solid rgba(3,26,96,0.08)"></div>
        <div class="absolute pointer-events-none"
             style="top:-100px; right:-100px; width:320px; height:320px; border-radius:50%;
                    background:radial-gradient(circle at 40% 40%, rgba(3,26,96,0.06) 0%, transparent 70%);
                    filter:blur(4px)"></div>
        <!-- Bottom-left glow -->
        <div class="absolute pointer-events-none"
             style="bottom:-50px; left:-50px; width:180px; height:180px; border-radius:50%;
                    background:radial-gradient(circle, rgba(41,159,77,0.08) 0%, transparent 70%);
                    filter:blur(30px)"></div>

        <div
          class="w-full max-w-sm relative z-10"
          v-motion
          :initial="{ opacity: 0, y: 24 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
        >
          <h1 class="text-2xl font-bold mb-1" style="color:#031a60">Sign in</h1>
          <p class="text-sm mb-6" style="color:#a8adc1">
            Don't have an account?
            <router-link to="/signup" class="font-semibold hover:underline" style="color:#299f4d">
              Create one free
            </router-link>
          </p>

          <!-- Role toggle -->
          <div class="flex rounded-xl p-1 mb-6" style="background:#f0f2f7">
            <button
              v-for="r in (['landlord', 'tenant'] as const)"
              :key="r"
              type="button"
              @click="setRole(r)"
              class="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg
                     text-sm font-semibold transition-all duration-200 cursor-pointer"
              :style="role === r
                ? 'background:white; color:#031a60; box-shadow:0 1px 8px rgba(3,26,96,0.1)'
                : 'color:#a8adc1'"
            >
              <component :is="r === 'landlord' ? Building2 : UserCheck" :size="14" />
              {{ r === 'landlord' ? 'Landlord' : 'Tenant' }}
            </button>
          </div>

          <!-- Error -->
          <div
            v-if="error"
            class="flex items-center gap-2 text-sm px-3 py-2.5 rounded-xl mb-4 border"
            style="background:rgba(220,38,38,0.05); border-color:rgba(220,38,38,0.2); color:#dc2626"
          >
            <AlertCircle :size="15" class="shrink-0" />
            {{ error }}
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4" novalidate>

            <!-- Email or Phone -->
            <div>
              <label class="block text-xs font-semibold mb-1.5" style="color:#1a2847">
                Email address or phone number
              </label>
              <div class="relative">
                <component
                  :is="identifierIcon"
                  :size="15"
                  class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200"
                  style="color:#a8adc1"
                />
                <input
                  v-model="identifier"
                  type="text"
                  autocomplete="username"
                  placeholder="you@example.com or +250 788 123 456"
                  required
                  class="w-full pl-9 pr-4 py-3 text-sm rounded-xl border-0 outline-none transition-all focus:ring-2"
                  style="background:#f0f2f7; color:#031a60; --tw-ring-color:rgba(3,26,96,0.15)"
                />
              </div>
            </div>

            <!-- Password -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-semibold" style="color:#1a2847">Password</label>
                <button type="button" class="text-xs hover:underline cursor-pointer" style="color:#299f4d">
                  Forgot password?
                </button>
              </div>
              <div class="relative">
                <Lock :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style="color:#a8adc1" />
                <input
                  v-model="password"
                  :type="showPass ? 'text' : 'password'"
                  autocomplete="current-password"
                  placeholder="••••••••"
                  required
                  class="w-full pl-9 pr-10 py-3 text-sm rounded-xl border-0 outline-none transition-all focus:ring-2"
                  style="background:#f0f2f7; color:#031a60; --tw-ring-color:rgba(3,26,96,0.15)"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  @click="showPass = !showPass"
                  :aria-label="showPass ? 'Hide' : 'Show'"
                >
                  <component :is="showPass ? EyeOff : Eye" :size="15" style="color:#a8adc1" />
                </button>
              </div>
            </div>

            <!-- Remember me -->
            <label class="flex items-center gap-2.5 cursor-pointer select-none">
              <input v-model="remember" type="checkbox" class="w-4 h-4 rounded cursor-pointer shrink-0" />
              <span class="text-xs" style="color:#a8adc1">Remember me for 30 days</span>
            </label>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                     text-sm font-semibold text-white transition-all duration-200
                     hover:opacity-90 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
              :style="`background:${panel.btnBg}`"
            >
              <svg v-if="loading" class="animate-spin shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="white" stroke-width="3" stroke-linecap="round"/>
              </svg>
              <span>{{ loading ? 'Signing in…' : panel.btnLabel }}</span>
              <ArrowRight v-if="!loading" :size="15" />
            </button>

          </form>

          <p class="text-center text-xs mt-6" style="color:#a8adc1">
            <router-link to="/" class="hover:underline" style="color:#a8adc1">
              ← Back to homepage
            </router-link>
          </p>

        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  .panel-left {
    clip-path: url(#login-d-clip);
  }
}
</style>
