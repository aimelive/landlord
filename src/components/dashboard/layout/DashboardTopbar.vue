<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Menu, X, Bell, Star, User, Settings, LogOut, ChevronDown } from 'lucide-vue-next'
import { useAuthStore } from '../../../stores/auth.store'

defineProps<{ sidebarOpen: boolean }>()
const emit = defineEmits<{ (e: 'toggle-sidebar'): void }>()

const auth = useAuthStore()
const router = useRouter()

const userName = computed(() => {
  const u = auth.user
  if (!u) return 'Guest'
  return `${u.first_name} ${u.last_name}`.trim() || u.email
})

const userInitials = computed(() => {
  const u = auth.user
  if (!u) return '?'
  const a = (u.first_name || u.email || '?').charAt(0)
  const b = (u.last_name || '').charAt(0)
  return (a + b).toUpperCase() || '?'
})

const portalLabel = computed(() =>
  auth.activeRole === 'landlord' ? 'Landlord Portal' : 'Tenant Portal',
)
const activeRoleLabel = computed(() =>
  auth.activeRole === 'landlord' ? 'Landlord' : 'Tenant',
)

// Item 7: avatar gradient mirrors the active role.
const avatarGradient = computed(() =>
  auth.activeRole === 'landlord'
    ? 'linear-gradient(135deg, #031a60, #0b2b8a)'
    : 'linear-gradient(135deg, #299f4d, #1a7038)',
)

const settingsPath = computed(
  () => `/dashboard/${auth.activeRole ?? 'tenant'}/settings`,
)
const accountPath = computed(
  () => `/dashboard/${auth.activeRole ?? 'tenant'}/account`,
)

// Item 6: profile dropdown
const menuOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}
function closeMenu() {
  menuOpen.value = false
}
function handleLogout() {
  closeMenu()
  auth.logout()
  router.push('/login')
}
function goSettings() {
  closeMenu()
  router.push(settingsPath.value)
}
function goAccount() {
  closeMenu()
  router.push(accountPath.value)
}

function onDocClick(e: MouseEvent) {
  if (!menuOpen.value) return
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) closeMenu()
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeMenu()
}
onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-30 flex items-center justify-between h-16 bg-white border-b"
    style="border-color:#dce1e9; box-shadow: 0 1px 12px rgba(3,26,96,0.06)"
  >
    <!-- Left: hamburger + logo + breadcrumb -->
    <div class="flex items-center gap-3 px-4">
      <button
        class="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-slate-100 lg:hidden"
        @click="emit('toggle-sidebar')"
        aria-label="Toggle sidebar"
      >
        <component :is="sidebarOpen ? X : Menu" :size="18" style="color:#031a60" />
      </button>

      <!-- Logo -->
      <img src="/logo.png" alt="LandLord" class="h-8 w-auto" />

      <!-- Divider + portal label (desktop only) -->
      <div class="hidden lg:flex items-center gap-3">
        <span class="w-px h-5" style="background:#dce1e9"></span>
        <div>
          <p class="text-xs font-medium leading-none" style="color:#a8adc1">{{ portalLabel }}</p>
          <p class="text-sm font-semibold leading-tight mt-0.5" style="color:#031a60">Dashboard</p>
        </div>
      </div>
    </div>

    <!-- Right: credit score + bell + avatar -->
    <div class="flex items-center gap-2 px-4">

      <!-- Credit Score badge — tenant-only concept -->
      <div
        v-if="auth.activeRole === 'tenant'"
        class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border"
        style="background:rgba(41,159,77,0.06); border-color:rgba(41,159,77,0.2)"
      >
        <Star :size="12" style="color:#299f4d" />
        <span class="text-xs font-bold" style="color:#299f4d">88</span>
        <span class="text-xs font-medium" style="color:#a8adc1">· Excellent</span>
      </div>

      <!-- Notification bell -->
      <button
        type="button"
        class="relative flex items-center justify-center w-9 h-9 rounded-xl transition-colors hover:bg-slate-100"
        aria-label="Notifications"
      >
        <Bell :size="17" style="color:#6b7294" />
        <span class="absolute top-2 right-2 w-2 h-2 rounded-full border-2 border-white"
              style="background:#ef4444"></span>
      </button>

      <!-- Divider -->
      <span class="w-px h-6 mx-1 hidden sm:block" style="background:#dce1e9"></span>

      <!-- User menu trigger + dropdown -->
      <div class="relative" ref="menuRef">
        <button
          type="button"
          @click="toggleMenu"
          :aria-expanded="menuOpen"
          aria-haspopup="menu"
          class="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-slate-50 cursor-pointer"
        >
          <div class="hidden sm:flex flex-col items-end leading-tight">
            <span class="text-xs font-semibold" style="color:#031a60">{{ userName }}</span>
            <span class="text-xs" style="color:#a8adc1">{{ activeRoleLabel }}</span>
          </div>
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 transition-[background]"
            :style="`background: ${avatarGradient}`"
          >
            {{ userInitials }}
          </div>
          <ChevronDown
            :size="14"
            class="hidden sm:block transition-transform duration-200"
            :class="menuOpen ? 'rotate-180' : ''"
            style="color:#a8adc1"
          />
        </button>

        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0 translate-y-[-4px]"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-[-4px]"
        >
          <div
            v-if="menuOpen"
            role="menu"
            class="absolute right-0 mt-2 w-60 rounded-xl bg-white border overflow-hidden"
            style="border-color:#e2e5ed; box-shadow: 0 16px 40px rgba(3,26,96,0.12); top:100%"
          >
            <!-- Header -->
            <div class="px-3 py-3 border-b" style="border-color:#f0f2f7">
              <p class="text-sm font-semibold truncate" style="color:#031a60">{{ userName }}</p>
              <p class="text-xs truncate" style="color:#a8adc1">{{ auth.user?.email }}</p>
            </div>

            <!-- Items -->
            <div class="py-1.5">
              <button
                type="button"
                role="menuitem"
                @click="goAccount"
                class="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50 cursor-pointer"
                style="color:#1a2847"
              >
                <User :size="15" style="color:#a8adc1" />
                <span>Account</span>
              </button>
              <button
                type="button"
                role="menuitem"
                @click="goSettings"
                class="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50 cursor-pointer"
                style="color:#1a2847"
              >
                <Settings :size="15" style="color:#a8adc1" />
                <span>Settings</span>
              </button>
              <button
                type="button"
                role="menuitem"
                @click="handleLogout"
                class="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors cursor-pointer hover:bg-red-50 group"
                style="color:#1a2847"
              >
                <LogOut :size="15" style="color:#a8adc1" class="group-hover:text-red-500! transition-colors" />
                <span class="group-hover:text-red-600 transition-colors">Log out</span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>
