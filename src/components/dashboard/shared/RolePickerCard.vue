<script setup lang="ts">
import { Building2, UserCheck, CheckCircle2 } from 'lucide-vue-next'
import { useAuthStore, type ActiveRole } from '../../../stores/auth.store'

defineEmits<{ (e: 'pick', role: ActiveRole): void }>()

const auth = useAuthStore()
</script>

<template>
  <div
    class="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 overflow-hidden"
    style="box-shadow: 0 32px 80px rgba(3,26,96,0.25)"
    v-motion
    :initial="{ opacity: 0, y: 24, scale: 0.98 }"
    :enter="{ opacity: 1, y: 0, scale: 1, transition: { duration: 500 } }"
  >
    <!-- Top gradient accent bar (navy → green) -->
    <div
      class="absolute top-0 left-0 right-0 h-1 pointer-events-none"
      style="background: linear-gradient(90deg, #031a60 0%, #299f4d 100%)"
    ></div>

    <!-- Soft brand-tinted corner blobs, contained by overflow-hidden -->
    <div
      class="absolute pointer-events-none"
      style="top:-70px; right:-60px; width:220px; height:220px; border-radius:50%;
             background:radial-gradient(circle, rgba(41,159,77,0.16) 0%, transparent 70%);
             filter:blur(40px)"
    ></div>
    <div
      class="absolute pointer-events-none"
      style="bottom:-90px; left:-70px; width:240px; height:240px; border-radius:50%;
             background:radial-gradient(circle, rgba(3,26,96,0.10) 0%, transparent 70%);
             filter:blur(50px)"
    ></div>

    <!-- Content sits above the decorations -->
    <div class="relative z-1">
      <div class="flex items-center gap-2.5 mb-4">
        <span class="logo-capsule">
          <img src="/logo.png" alt="LandLord" class="h-6 w-auto" />
        </span>
      </div>

      <h2 class="text-xl font-bold mb-1" style="color:#031a60">
        Choose how you'll use LandLord
      </h2>
      <p class="text-sm mb-5" style="color:#6b7294">
        You have both a landlord and a tenant account. Pick one to continue - you can switch any time.
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          @click="$emit('pick', 'landlord')"
          :aria-pressed="auth.activeRole === 'landlord'"
          class="role-card group relative flex flex-col items-start gap-1.5 p-4 rounded-2xl border-2 text-left cursor-pointer overflow-hidden"
          :style="
            auth.activeRole === 'landlord'
              ? 'border-color:#031a60;background:linear-gradient(135deg,#f3f5fb 0%,rgba(3,26,96,0.05) 100%)'
              : 'border-color:#e2e5ed;background:white'
          "
        >
          <span
            class="icon-tile w-10 h-10 rounded-xl flex items-center justify-center"
            :style="
              auth.activeRole === 'landlord'
                ? 'background:#031a60;color:white;box-shadow:0 6px 16px rgba(3,26,96,0.25)'
                : 'background:#f0f2f7;color:#031a60'
            "
          >
            <Building2 :size="18" />
          </span>
          <span class="text-sm font-semibold mt-0.5" style="color:#031a60">Continue as landlord</span>
          <span class="text-xs leading-snug" style="color:#a8adc1">
            Manage properties & tenants
          </span>
          <CheckCircle2
            v-if="auth.activeRole === 'landlord'"
            :size="14"
            class="absolute top-3 right-3"
            style="color:#299f4d"
          />
        </button>

        <button
          type="button"
          @click="$emit('pick', 'tenant')"
          :aria-pressed="auth.activeRole === 'tenant'"
          class="role-card group relative flex flex-col items-start gap-1.5 p-4 rounded-2xl border-2 text-left cursor-pointer overflow-hidden"
          :style="
            auth.activeRole === 'tenant'
              ? 'border-color:#299f4d;background:linear-gradient(135deg,#f1faf4 0%,rgba(41,159,77,0.08) 100%)'
              : 'border-color:#e2e5ed;background:white'
          "
        >
          <span
            class="icon-tile w-10 h-10 rounded-xl flex items-center justify-center"
            :style="
              auth.activeRole === 'tenant'
                ? 'background:#299f4d;color:white;box-shadow:0 6px 16px rgba(41,159,77,0.3)'
                : 'background:#f0f2f7;color:#031a60'
            "
          >
            <UserCheck :size="18" />
          </span>
          <span class="text-sm font-semibold mt-0.5" style="color:#031a60">Continue as tenant</span>
          <span class="text-xs leading-snug" style="color:#a8adc1">
            Track rent & build credit
          </span>
          <CheckCircle2
            v-if="auth.activeRole === 'tenant'"
            :size="14"
            class="absolute top-3 right-3"
            style="color:#299f4d"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.role-card {
  transition:
    transform 0.22s cubic-bezier(0.33, 1, 0.68, 1),
    box-shadow 0.25s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.role-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 32px rgba(3, 26, 96, 0.1);
}

.role-card:active {
  transform: translateY(-1px) scale(0.99);
  box-shadow: 0 6px 14px rgba(3, 26, 96, 0.08);
  transition-duration: 0.08s;
}

.role-card:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(3, 26, 96, 0.18);
}

.icon-tile {
  transition: transform 0.25s cubic-bezier(0.33, 1, 0.68, 1);
}
.role-card:hover .icon-tile {
  transform: scale(1.08) rotate(-2deg);
}
.role-card:active .icon-tile {
  transform: scale(0.96);
}
</style>
