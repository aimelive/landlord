<script setup lang="ts">
import { Menu, X, Bell, Star } from 'lucide-vue-next'

defineProps<{ sidebarOpen: boolean }>()
const emit = defineEmits<{ (e: 'toggle-sidebar'): void }>()
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

      <!-- Divider + page label (desktop only) -->
      <div class="hidden lg:flex items-center gap-3">
        <span class="w-px h-5" style="background:#dce1e9"></span>
        <div>
          <p class="text-xs font-medium leading-none" style="color:#a8adc1">Tenant Portal</p>
          <p class="text-sm font-semibold leading-tight mt-0.5" style="color:#031a60">Dashboard</p>
        </div>
      </div>
    </div>

    <!-- Right: credit score + bell + avatar -->
    <div class="flex items-center gap-2 px-4">

      <!-- Credit Score badge (desktop) -->
      <div class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border"
           style="background:rgba(41,159,77,0.06); border-color:rgba(41,159,77,0.2)">
        <Star :size="12" style="color:#299f4d" />
        <span class="text-xs font-bold" style="color:#299f4d">88</span>
        <span class="text-xs font-medium" style="color:#a8adc1">· Excellent</span>
      </div>

      <!-- Notification bell -->
      <button class="relative flex items-center justify-center w-9 h-9 rounded-xl transition-colors hover:bg-slate-100"
              aria-label="Notifications">
        <Bell :size="17" style="color:#6b7294" />
        <!-- Red dot -->
        <span class="absolute top-2 right-2 w-2 h-2 rounded-full border-2 border-white"
              style="background:#ef4444"></span>
      </button>

      <!-- Divider -->
      <span class="w-px h-6 mx-1 hidden sm:block" style="background:#dce1e9"></span>

      <!-- Tenant info + avatar -->
      <div class="flex items-center gap-2.5 cursor-pointer rounded-xl px-2 py-1.5 hover:bg-slate-50 transition-colors">
        <div class="hidden sm:flex flex-col items-end leading-tight">
          <span class="text-xs font-semibold" style="color:#031a60">Jean Mugisha</span>
          <span class="text-xs" style="color:#a8adc1">Tenant</span>
        </div>
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
             style="background: linear-gradient(135deg, #299f4d, #1a7038)">
          JM
        </div>
      </div>
    </div>
  </header>
</template>
