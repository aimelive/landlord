<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import {
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  Building2,
  UserCheck,
  LogOut,
  ShieldCheck,
} from "lucide-vue-next";
import { useAuthStore } from "../../../stores/auth.store";

const auth = useAuthStore();
const router = useRouter();

const user = computed(() => auth.user);

const fullName = computed(() => {
  const u = user.value;
  if (!u) return "";
  return `${u.first_name} ${u.last_name}`.trim() || u.email;
});

const initials = computed(() => {
  const u = user.value;
  if (!u) return "?";
  const a = (u.first_name || u.email || "?").charAt(0);
  const b = (u.last_name || "").charAt(0);
  return (a + b).toUpperCase() || "?";
});

const avatarGradient = computed(() =>
  auth.activeRole === "landlord"
    ? "linear-gradient(135deg, #031a60, #0b2b8a)"
    : "linear-gradient(135deg, #299f4d, #1a7038)",
);

const memberSince = computed(() => {
  const raw = user.value?.created_at;
  if (!raw) return "—";
  try {
    return new Date(raw).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "—";
  }
});

function handleLogout() {
  auth.logout();
  router.push("/login");
}
</script>

<template>
  <div v-if="user" class="space-y-6">
    <!-- ── Header ───────────────────────────────────────────── -->
    <section
      class="rounded-2xl bg-white border p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-5"
      style="border-color: #e8eaf0"
    >
      <div
        class="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shrink-0"
        :style="`background: ${avatarGradient}; box-shadow: 0 8px 24px rgba(3,26,96,0.18)`"
      >
        {{ initials }}
      </div>
      <div class="flex-1 min-w-0">
        <h1 class="text-2xl font-bold mb-1 truncate" style="color: #031a60">
          {{ fullName }}
        </h1>
        <p class="text-sm mb-3 truncate" style="color: #6b7294">
          {{ user.email }}
        </p>
        <div class="flex flex-wrap gap-2">
          <span
            v-if="user.is_landlord"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            :style="
              auth.activeRole === 'landlord'
                ? 'background:#031a60;color:white'
                : 'background:rgba(3,26,96,0.08);color:#031a60'
            "
          >
            <Building2 :size="12" />
            Landlord
          </span>
          <span
            v-if="user.is_tenant"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            :style="
              auth.activeRole === 'tenant'
                ? 'background:#299f4d;color:white'
                : 'background:rgba(41,159,77,0.1);color:#1a7038'
            "
          >
            <UserCheck :size="12" />
            Tenant
          </span>
        </div>
      </div>
    </section>

    <!-- ── Personal information ─────────────────────────────── -->
    <section class="rounded-2xl bg-white border" style="border-color: #e8eaf0">
      <header class="px-6 py-4 border-b" style="border-color: #f0f2f7">
        <h2 class="text-sm font-bold" style="color: #031a60">
          Personal information
        </h2>
        <p class="text-xs mt-0.5" style="color: #a8adc1">
          Details on your LandLord account
        </p>
      </header>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x"
        style="divide-color: #f0f2f7"
      >
        <div class="px-6 py-4">
          <p
            class="text-xs font-semibold uppercase tracking-widest mb-1"
            style="color: #a8adc1"
          >
            First name
          </p>
          <p class="text-sm font-medium" style="color: #031a60">
            {{ user.first_name || "—" }}
          </p>
        </div>
        <div class="px-6 py-4">
          <p
            class="text-xs font-semibold uppercase tracking-widest mb-1"
            style="color: #a8adc1"
          >
            Last name
          </p>
          <p class="text-sm font-medium" style="color: #031a60">
            {{ user.last_name || "—" }}
          </p>
        </div>
        <div class="px-6 py-4">
          <p
            class="text-xs font-semibold uppercase tracking-widest mb-1 flex items-center gap-2"
            style="color: #a8adc1"
          >
            <Mail :size="11" />
            Email
          </p>
          <div class="flex items-center gap-2">
            <p class="text-sm font-medium truncate" style="color: #031a60">
              {{ user.email || "—" }}
            </p>
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold shrink-0"
              :style="
                user.is_email_verified
                  ? 'background:rgba(41,159,77,0.12);color:#1a7038'
                  : 'background:rgba(245,158,11,0.12);color:#b45309'
              "
            >
              <CheckCircle2 v-if="user.is_email_verified" :size="10" />
              <XCircle v-else :size="10" />
              {{ user.is_email_verified ? "Verified" : "Unverified" }}
            </span>
          </div>
        </div>
        <div class="px-6 py-4">
          <p
            class="text-xs font-semibold uppercase tracking-widest mb-1 flex items-center gap-2"
            style="color: #a8adc1"
          >
            <Phone :size="11" />
            Phone
          </p>
          <div class="flex items-center gap-2">
            <p class="text-sm font-medium truncate" style="color: #031a60">
              {{ user.phone_number || "—" }}
            </p>
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold shrink-0"
              :style="
                user.is_phone_verified
                  ? 'background:rgba(41,159,77,0.12);color:#1a7038'
                  : 'background:rgba(245,158,11,0.12);color:#b45309'
              "
            >
              <CheckCircle2 v-if="user.is_phone_verified" :size="10" />
              <XCircle v-else :size="10" />
              {{ user.is_phone_verified ? "Verified" : "Unverified" }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Account details ──────────────────────────────────── -->
    <section class="rounded-2xl bg-white border" style="border-color: #e8eaf0">
      <header class="px-6 py-4 border-b" style="border-color: #f0f2f7">
        <h2 class="text-sm font-bold" style="color: #031a60">Account</h2>
      </header>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x"
        style="divide-color: #f0f2f7"
      >
        <div class="px-6 py-4">
          <p
            class="text-xs font-semibold uppercase tracking-widest mb-1 flex items-center gap-2"
            style="color: #a8adc1"
          >
            <Calendar :size="11" />
            Member since
          </p>
          <p class="text-sm font-medium" style="color: #031a60">
            {{ memberSince }}
          </p>
        </div>
        <div class="px-6 py-4">
          <p
            class="text-xs font-semibold uppercase tracking-widest mb-1 flex items-center gap-2"
            style="color: #a8adc1"
          >
            <ShieldCheck :size="11" />
            Active role
          </p>
          <p class="text-sm font-medium capitalize" style="color: #031a60">
            {{ auth.activeRole || "—" }}
          </p>
        </div>
      </div>
    </section>

    <!-- ── Sign out ─────────────────────────────────────────── -->
    <section
      class="rounded-2xl border p-5 flex items-center justify-between gap-4"
      style="
        border-color: rgba(239, 68, 68, 0.2);
        background: rgba(239, 68, 68, 0.04);
      "
    >
      <div>
        <p class="text-sm font-semibold" style="color: #031a60">Sign out</p>
        <p class="text-xs mt-0.5" style="color: #6b7294">
          End your session on this device.
        </p>
      </div>
      <button
        type="button"
        @click="handleLogout"
        class="inline-flex items-center gap-2 py-2 px-4 rounded-xl text-sm font-semibold cursor-pointer transition-colors"
        style="
          background: white;
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #b91c1c;
        "
      >
        <LogOut :size="14" />
        Sign out
      </button>
    </section>
  </div>
</template>
