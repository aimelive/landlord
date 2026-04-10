<script setup lang="ts">
import { useRoute } from 'vue-router'
import {
  LayoutDashboard, CalendarRange, FileText, Home,
  Wallet, Bell, AlarmClock, ShieldCheck, Settings,
  LogOut, type LucideIcon,
} from 'lucide-vue-next'

const route = useRoute()
defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

type NavItem = { label: string; icon: LucideIcon; path: string; badge?: number }

const mainItems: NavItem[] = [
  { label: 'Dashboard',         icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Coverage Timeline', icon: CalendarRange,   path: '/dashboard/coverage' },
  { label: 'Payment Records',   icon: FileText,        path: '/dashboard/payments' },
  { label: 'My Rents',          icon: Home,            path: '/dashboard/rents' },
  { label: 'Extra Bills',       icon: Wallet,          path: '/dashboard/bills' },
]

const secondaryItems: NavItem[] = [
  { label: 'Notifications',    icon: Bell,         path: '/dashboard/notifications', badge: 2 },
  { label: 'Reminders',        icon: AlarmClock,   path: '/dashboard/reminders',    badge: 1 },
  { label: 'ID Verifications', icon: ShieldCheck,  path: '/dashboard/verification' },
  { label: 'Settings',         icon: Settings,     path: '/dashboard/settings' },
]

function isActive(path: string) {
  return route.path === path
}

</script>

<template>
  <!-- Mobile backdrop -->
  <Transition name="fade">
    <div v-if="open" class="fixed inset-0 z-20 lg:hidden"
         style="background:rgba(3,26,96,0.4); backdrop-filter:blur(2px)"
         @click="emit('close')" />
  </Transition>

  <!-- Sidebar panel -->
  <aside
    class="fixed top-16 left-0 bottom-0 z-20 w-64 flex flex-col transition-transform duration-300 ease-in-out bg-white border-r"
    :class="open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    style="border-color:#e8eaf0; box-shadow: 1px 0 12px rgba(3,26,96,0.05)"
  >

    <!-- Nav -->
    <nav class="flex-1 overflow-y-auto py-5 px-3 flex flex-col gap-0.5">

      <!-- Main items -->
      <div class="flex flex-col gap-0.5">
        <RouterLink
          v-for="item in mainItems"
          :key="item.label"
          :to="item.path"
          @click="emit('close')"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer no-underline"
          :style="isActive(item.path)
            ? 'background:rgba(3,26,96,0.07); color:#031a60;'
            : 'color:#6b7294;'"
          :class="!isActive(item.path) ? 'hover:bg-slate-50' : ''"
        >
          <component :is="item.icon" :size="16" class="shrink-0"
                     :style="isActive(item.path) ? 'color:#031a60' : 'color:#a8adc1'" />
          <span class="flex-1">{{ item.label }}</span>
          <!-- Active bar -->
          <span v-if="isActive(item.path)"
                class="w-1 h-5 rounded-full shrink-0"
                style="background:#299f4d"></span>
        </RouterLink>
      </div>

      <!-- Divider -->
      <div class="my-3 border-t" style="border-color:#e8eaf0"></div>

      <!-- Secondary items -->
      <div class="flex flex-col gap-0.5">
        <RouterLink
          v-for="item in secondaryItems"
          :key="item.label"
          :to="item.path"
          @click="emit('close')"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer no-underline"
          :style="isActive(item.path)
            ? 'background:rgba(3,26,96,0.07); color:#031a60;'
            : 'color:#6b7294;'"
          :class="!isActive(item.path) ? 'hover:bg-slate-50' : ''"
        >
          <component :is="item.icon" :size="16" class="shrink-0"
                     :style="isActive(item.path) ? 'color:#031a60' : 'color:#a8adc1'" />
          <span class="flex-1">{{ item.label }}</span>
          <!-- Notification badge -->
          <span v-if="item.badge"
                class="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-xs font-bold text-white shrink-0"
                style="background:#ef4444; font-size:10px">
            {{ item.badge }}
          </span>
          <!-- Active bar -->
          <span v-else-if="isActive(item.path)"
                class="w-1 h-5 rounded-full shrink-0"
                style="background:#299f4d"></span>
        </RouterLink>
      </div>
    </nav>

    <!-- User profile footer -->
    <div class="px-3 py-4 border-t shrink-0" style="border-color:#e8eaf0">
      <div class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer">
        <!-- Avatar -->
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
             style="background: linear-gradient(135deg, #299f4d, #1a7038)">
          JM
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold truncate" style="color:#031a60">Jean Mugisha</p>
          <p class="text-xs truncate" style="color:#a8adc1">Tenant</p>
        </div>
        <LogOut :size="14" style="color:#c8cdd8" class="shrink-0" />
      </div>
    </div>

  </aside>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.no-underline { text-decoration: none; }
</style>
