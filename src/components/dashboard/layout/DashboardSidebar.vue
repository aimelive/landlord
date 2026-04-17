<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  LayoutDashboard,
  CalendarRange,
  FileText,
  Bell,
  AlarmClock,
  ShieldCheck,
  Settings,
  Building2,
  LogOut,
  Repeat,
  type LucideIcon,
} from "lucide-vue-next";
import { useAuthStore, type ActiveRole } from "../../../stores/auth.store";
import RolePickerModal from "../shared/RolePickerModal.vue";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: "close"): void }>();

const switcherOpen = ref(false);

// Base path for nav items — always targets the currently active role subtree.
// Falls back defensively to 'tenant' but this branch is unreachable because
// the sidebar is only mounted inside role-scoped routes.
const base = computed(() => `/dashboard/${auth.activeRole ?? "tenant"}`);

function onSwitchRole(role: ActiveRole) {
  auth.setActiveRole(role);
  switcherOpen.value = false;
  emit("close");
  router.push(`/dashboard/${role}`);
}

const userName = computed(() => {
  const u = auth.user;
  if (!u) return "Guest";
  return `${u.first_name} ${u.last_name}`.trim() || u.email;
});

const userInitials = computed(() => {
  const u = auth.user;
  if (!u) return "?";
  const a = (u.first_name || u.email || "?").charAt(0);
  const b = (u.last_name || "").charAt(0);
  return (a + b).toUpperCase() || "?";
});

const userRole = computed(() => {
  const u = auth.user;
  if (!u) return "";
  if (u.is_landlord && u.is_tenant) return "Landlord & Tenant";
  if (u.is_landlord) return "Landlord";
  if (u.is_tenant) return "Tenant";
  return "Member";
});

// Match the topbar: avatar gradient tracks the active role.
const avatarGradient = computed(() =>
  auth.activeRole === "landlord"
    ? "linear-gradient(135deg, #031a60, #0b2b8a)"
    : "linear-gradient(135deg, #299f4d, #1a7038)",
);

function handleLogout() {
  auth.logout();
  emit("close");
  router.push("/login");
}

type NavItem = {
  label: string;
  icon: LucideIcon;
  path: string;
  badge?: number;
};

// Main nav is role-specific; secondary nav is shared between roles.
const tenantMain = computed<NavItem[]>(() => [
  { label: "Dashboard", icon: LayoutDashboard, path: base.value },
  {
    label: "Coverage Timeline",
    icon: CalendarRange,
    path: `${base.value}/coverage`,
  },
  { label: "Payment Records", icon: FileText, path: `${base.value}/payments` },
]);

const landlordMain = computed<NavItem[]>(() => [
  { label: "Dashboard", icon: LayoutDashboard, path: base.value },
  { label: "Properties", icon: Building2, path: `${base.value}/properties` },
]);

const mainItems = computed<NavItem[]>(() =>
  auth.activeRole === "landlord" ? landlordMain.value : tenantMain.value,
);

const secondaryItems = computed<NavItem[]>(() => [
  {
    label: "Notifications",
    icon: Bell,
    path: `${base.value}/notifications`,
    badge: 2,
  },
  {
    label: "Reminders",
    icon: AlarmClock,
    path: `${base.value}/reminders`,
    badge: 1,
  },
  {
    label: "ID Verifications",
    icon: ShieldCheck,
    path: `${base.value}/verification`,
  },
  { label: "Settings", icon: Settings, path: `${base.value}/settings` },
]);

function isActive(path: string) {
  return route.path === path;
}
</script>

<template>
  <!-- Mobile backdrop -->
  <Transition name="fade">
    <div
      v-if="open"
      class="fixed inset-0 z-20 lg:hidden"
      style="background: rgba(3, 26, 96, 0.4); backdrop-filter: blur(2px)"
      @click="emit('close')"
    />
  </Transition>

  <!-- Sidebar panel -->
  <aside
    class="fixed top-16 left-0 bottom-0 z-20 w-64 flex flex-col transition-transform duration-300 ease-in-out bg-white border-r"
    :class="open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    style="border-color: #e8eaf0; box-shadow: 1px 0 12px rgba(3, 26, 96, 0.05)"
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
          :style="
            isActive(item.path)
              ? 'background:rgba(3,26,96,0.07); color:#031a60;'
              : 'color:#6b7294;'
          "
          :class="!isActive(item.path) ? 'hover:bg-slate-50' : ''"
        >
          <component
            :is="item.icon"
            :size="16"
            class="shrink-0"
            :style="isActive(item.path) ? 'color:#031a60' : 'color:#a8adc1'"
          />
          <span class="flex-1">{{ item.label }}</span>
          <!-- Active bar -->
          <span
            v-if="isActive(item.path)"
            class="w-1 h-5 rounded-full shrink-0"
            style="background: #299f4d"
          ></span>
        </RouterLink>
      </div>

      <!-- Divider -->
      <div class="my-3 border-t" style="border-color: #e8eaf0"></div>

      <!-- Secondary items -->
      <div class="flex flex-col gap-0.5">
        <RouterLink
          v-for="item in secondaryItems"
          :key="item.label"
          :to="item.path"
          @click="emit('close')"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer no-underline"
          :style="
            isActive(item.path)
              ? 'background:rgba(3,26,96,0.07); color:#031a60;'
              : 'color:#6b7294;'
          "
          :class="!isActive(item.path) ? 'hover:bg-slate-50' : ''"
        >
          <component
            :is="item.icon"
            :size="16"
            class="shrink-0"
            :style="isActive(item.path) ? 'color:#031a60' : 'color:#a8adc1'"
          />
          <span class="flex-1">{{ item.label }}</span>
          <!-- Notification badge -->
          <span
            v-if="item.badge"
            class="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-xs font-bold text-white shrink-0"
            style="background: #ef4444; font-size: 10px"
          >
            {{ item.badge }}
          </span>
          <!-- Active bar -->
          <span
            v-else-if="isActive(item.path)"
            class="w-1 h-5 rounded-full shrink-0"
            style="background: #299f4d"
          ></span>
        </RouterLink>
      </div>
    </nav>

    <!-- User profile footer -->
    <div class="px-3 py-4 border-t shrink-0" style="border-color: #e8eaf0">
      <!-- Switch-role row (dual-role users only) -->
      <button
        v-if="auth.hasBothRoles"
        type="button"
        @click="switcherOpen = true"
        class="w-full flex items-center gap-3 px-3 py-2 mb-1.5 rounded-xl text-sm font-medium transition-colors cursor-pointer hover:bg-slate-50"
        style="color: #6b7294"
      >
        <Repeat :size="14" style="color: #a8adc1" class="shrink-0" />
        <span class="flex-1 text-left">
          Switch to {{ auth.activeRole === "landlord" ? "tenant" : "landlord" }}
        </span>
      </button>

      <div class="flex items-center gap-1">
        <!-- Clickable user info → account page -->
        <RouterLink
          :to="`${base}/account`"
          @click="emit('close')"
          class="flex-1 flex items-center gap-3 px-3 py-2 rounded-xl min-w-0 no-underline transition-colors hover:bg-slate-50"
        >
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            :style="`background: ${avatarGradient}`"
          >
            {{ userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold truncate" style="color: #031a60">
              {{ userName }}
            </p>
            <p class="text-xs truncate" style="color: #a8adc1">
              {{ userRole }}
            </p>
          </div>
        </RouterLink>
        <button
          type="button"
          @click="handleLogout"
          aria-label="Log out"
          title="Log out"
          class="w-8 h-8 flex items-center justify-center rounded-lg shrink-0 cursor-pointer transition-colors hover:bg-red-50 group"
        >
          <LogOut
            :size="14"
            style="color: #c8cdd8"
            class="group-hover:text-red-500! transition-colors"
          />
        </button>
      </div>
    </div>
  </aside>

  <RolePickerModal
    :open="switcherOpen"
    @pick="onSwitchRole"
    @close="switcherOpen = false"
  />
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.no-underline {
  text-decoration: none;
}
</style>
