<script setup lang="ts">
import { computed } from 'vue'
import {
  Building2, Users, TrendingUp, AlertCircle,
  CheckCircle2, Clock, Banknote, UserPlus, FileCheck2, Bell, Wrench,
  ArrowUpRight, CalendarClock, ChevronRight,
} from 'lucide-vue-next'
import { useAuthStore } from '../../../stores/auth.store'
import {
  landlordPortfolio,
  totalUnits, occupiedUnits, occupancyPct,
  expectedMonthlyRevenue, collectedThisMonth, pendingThisMonth,
  overduePayments, overdueAmount,
  formatRWF, formatRWFCompact, formatDateShort, relativeTime, daysUntil,
  type ActivityType, type PaymentStatus,
} from '../../../data/landlordPortfolio'

const auth = useAuthStore()

const firstName = computed(() => auth.user?.first_name || 'there')

const expected = expectedMonthlyRevenue()
const collected = collectedThisMonth()
const pending = pendingThisMonth()
const collectedPct = Math.round((collected / expected) * 100)
const trendVsLastMonth = 12 // mock

const overdueList = overduePayments()
const overdueCount = overdueList.length
const overdueTotal = overdueAmount()

const properties = landlordPortfolio.properties

const upcomingSorted = computed(() =>
  [...landlordPortfolio.upcoming_payments].sort((a, b) => {
    // Overdue first, then by due date ascending
    const rank: Record<PaymentStatus, number> = { overdue: 0, pending: 1, paid: 2 }
    if (rank[a.status] !== rank[b.status]) return rank[a.status] - rank[b.status]
    return a.due_date.localeCompare(b.due_date)
  }),
)

function initials(name: string): string {
  const parts = name.split(' ').filter(Boolean)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
}

const statusMeta: Record<PaymentStatus, { bg: string; color: string; icon: typeof CheckCircle2; label: string }> = {
  paid:    { bg: 'rgba(41,159,77,0.12)',  color: '#1a7038', icon: CheckCircle2, label: 'Paid' },
  pending: { bg: 'rgba(245,158,11,0.12)', color: '#b45309', icon: Clock,        label: 'Pending' },
  overdue: { bg: 'rgba(239,68,68,0.12)',  color: '#b91c1c', icon: AlertCircle,  label: 'Overdue' },
}

const activityMeta: Record<ActivityType, { icon: typeof Banknote; bg: string; color: string }> = {
  payment_received: { icon: Banknote,    bg: 'rgba(41,159,77,0.12)',  color: '#299f4d' },
  lease_signed:     { icon: FileCheck2,  bg: 'rgba(3,26,96,0.08)',    color: '#031a60' },
  tenant_joined:    { icon: UserPlus,    bg: 'rgba(91,138,245,0.14)', color: '#3b82f6' },
  reminder_sent:    { icon: Bell,        bg: 'rgba(245,158,11,0.14)', color: '#b45309' },
  maintenance:      { icon: Wrench,      bg: 'rgba(3,26,96,0.08)',    color: '#6b7294' },
}

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
})
</script>

<template>
  <div class="space-y-6">

    <!-- ── Hero ─────────────────────────────────────────────────────────── -->
    <section
      class="relative overflow-hidden rounded-2xl p-6 sm:p-8 text-white"
      style="background: linear-gradient(135deg, #031a60 0%, #0b2b8a 55%, #1a3fa8 100%)"
    >
      <!-- soft decorative blobs -->
      <div
        class="absolute pointer-events-none"
        style="top:-80px; right:-40px; width:320px; height:320px; border-radius:50%;
               background:radial-gradient(circle, rgba(41,159,77,0.4) 0%, transparent 70%);
               filter:blur(70px)"
      ></div>
      <div
        class="absolute pointer-events-none"
        style="bottom:-100px; left:30%; width:260px; height:260px; border-radius:50%;
               background:radial-gradient(circle, rgba(91,138,245,0.3) 0%, transparent 70%);
               filter:blur(60px)"
      ></div>

      <div class="relative z-1 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <p class="text-xs font-semibold uppercase tracking-widest opacity-70 mb-1.5">
            {{ greeting }}
          </p>
          <h1 class="text-2xl sm:text-3xl font-bold leading-tight mb-1">
            Welcome back, {{ firstName }}.
          </h1>
          <p class="text-sm opacity-80">
            Here's how your portfolio is doing this month.
          </p>
        </div>

        <div class="lg:min-w-90">
          <div class="flex items-baseline justify-between mb-2">
            <span class="text-xs font-semibold uppercase tracking-widest opacity-70">
              Collected this month
            </span>
            <span
              class="flex items-center gap-1 text-xs font-semibold"
              style="color:#4fd87c"
            >
              <ArrowUpRight :size="12" />
              {{ trendVsLastMonth }}% vs March
            </span>
          </div>
          <p class="text-3xl sm:text-4xl font-bold tracking-tight leading-none mb-3">
            {{ formatRWF(collected) }}
          </p>
          <!-- Progress toward expected -->
          <div class="h-2 rounded-full overflow-hidden" style="background:rgba(255,255,255,0.15)">
            <div
              class="h-full rounded-full transition-all duration-500"
              :style="`width:${collectedPct}%; background: linear-gradient(90deg, #299f4d, #4fd87c)`"
            ></div>
          </div>
          <p class="text-xs mt-2 opacity-80">
            {{ collectedPct }}% of {{ formatRWF(expected) }} expected · {{ formatRWF(pending) }} still pending
          </p>
        </div>
      </div>
    </section>

    <!-- ── KPI tiles ────────────────────────────────────────────────────── -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="rounded-2xl bg-white border p-5" style="border-color:#e8eaf0">
        <div class="flex items-center justify-between mb-3">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center"
            style="background:rgba(3,26,96,0.08); color:#031a60"
          >
            <Building2 :size="18" />
          </div>
        </div>
        <p class="text-xs font-semibold uppercase tracking-widest mb-1" style="color:#a8adc1">
          Properties
        </p>
        <p class="text-2xl font-bold" style="color:#031a60">
          {{ properties.length }}
        </p>
        <p class="text-xs mt-1" style="color:#6b7294">
          {{ totalUnits() }} total units
        </p>
      </div>

      <div class="rounded-2xl bg-white border p-5" style="border-color:#e8eaf0">
        <div class="flex items-center justify-between mb-3">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center"
            style="background:rgba(41,159,77,0.12); color:#299f4d"
          >
            <TrendingUp :size="18" />
          </div>
          <span class="text-xs font-semibold" style="color:#299f4d">
            {{ occupancyPct() }}%
          </span>
        </div>
        <p class="text-xs font-semibold uppercase tracking-widest mb-1" style="color:#a8adc1">
          Occupancy
        </p>
        <p class="text-2xl font-bold" style="color:#031a60">
          {{ occupiedUnits() }} / {{ totalUnits() }}
        </p>
        <div class="mt-2 h-1.5 rounded-full overflow-hidden" style="background:#f0f2f7">
          <div
            class="h-full rounded-full"
            :style="`width:${occupancyPct()}%; background:#299f4d`"
          ></div>
        </div>
      </div>

      <div class="rounded-2xl bg-white border p-5" style="border-color:#e8eaf0">
        <div class="flex items-center justify-between mb-3">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center"
            style="background:rgba(91,138,245,0.14); color:#3b82f6"
          >
            <Users :size="18" />
          </div>
        </div>
        <p class="text-xs font-semibold uppercase tracking-widest mb-1" style="color:#a8adc1">
          Active Tenants
        </p>
        <p class="text-2xl font-bold" style="color:#031a60">
          {{ occupiedUnits() }}
        </p>
        <p class="text-xs mt-1" style="color:#6b7294">
          Across {{ properties.length }} properties
        </p>
      </div>

      <div
        class="rounded-2xl border p-5"
        :style="
          overdueCount > 0
            ? 'background:rgba(239,68,68,0.04); border-color:rgba(239,68,68,0.3)'
            : 'background:white; border-color:#e8eaf0'
        "
      >
        <div class="flex items-center justify-between mb-3">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center"
            :style="
              overdueCount > 0
                ? 'background:rgba(239,68,68,0.12); color:#b91c1c'
                : 'background:rgba(41,159,77,0.12); color:#299f4d'
            "
          >
            <AlertCircle v-if="overdueCount > 0" :size="18" />
            <CheckCircle2 v-else :size="18" />
          </div>
        </div>
        <p class="text-xs font-semibold uppercase tracking-widest mb-1" style="color:#a8adc1">
          Overdue
        </p>
        <p class="text-2xl font-bold" :style="overdueCount > 0 ? 'color:#b91c1c' : 'color:#031a60'">
          {{ overdueCount > 0 ? formatRWFCompact(overdueTotal) : 'All clear' }}
        </p>
        <p class="text-xs mt-1" style="color:#6b7294">
          {{ overdueCount > 0 ? `${overdueCount} tenant${overdueCount > 1 ? 's' : ''} behind` : 'No overdue rent' }}
        </p>
      </div>
    </section>

    <!-- ── Row A: Upcoming payments + Properties ────────────────────────── -->
    <section class="grid grid-cols-1 lg:grid-cols-12 gap-6">

      <!-- Upcoming payments -->
      <div class="lg:col-span-7 rounded-2xl bg-white border" style="border-color:#e8eaf0">
        <header class="flex items-center justify-between px-5 py-4 border-b" style="border-color:#f0f2f7">
          <div>
            <h2 class="text-sm font-bold" style="color:#031a60">This month's rent</h2>
            <p class="text-xs mt-0.5" style="color:#a8adc1">
              Overdue first, then upcoming by date
            </p>
          </div>
          <button
            type="button"
            class="text-xs font-semibold flex items-center gap-0.5 cursor-pointer hover:underline"
            style="color:#299f4d"
          >
            View all
            <ChevronRight :size="12" />
          </button>
        </header>

        <ul class="divide-y" style="divide-color:#f0f2f7">
          <li
            v-for="p in upcomingSorted"
            :key="p.id"
            class="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50"
          >
            <div
              class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style="background: linear-gradient(135deg, #031a60, #0b2b8a)"
            >
              {{ initials(p.tenant_name) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold truncate" style="color:#031a60">
                {{ p.tenant_name }}
              </p>
              <p class="text-xs truncate" style="color:#a8adc1">
                {{ p.property_name }} · {{ p.unit }}
              </p>
            </div>
            <div class="text-right shrink-0 hidden sm:block">
              <p class="text-sm font-semibold" style="color:#031a60">
                {{ formatRWF(p.amount) }}
              </p>
              <p class="text-xs" style="color:#a8adc1">
                Due {{ formatDateShort(p.due_date) }}
              </p>
            </div>
            <span
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0"
              :style="`background:${statusMeta[p.status].bg}; color:${statusMeta[p.status].color}`"
            >
              <component :is="statusMeta[p.status].icon" :size="11" />
              {{ statusMeta[p.status].label }}
            </span>
          </li>
        </ul>
      </div>

      <!-- Properties overview -->
      <div class="lg:col-span-5 rounded-2xl bg-white border" style="border-color:#e8eaf0">
        <header class="flex items-center justify-between px-5 py-4 border-b" style="border-color:#f0f2f7">
          <h2 class="text-sm font-bold" style="color:#031a60">Your properties</h2>
          <button
            type="button"
            class="text-xs font-semibold flex items-center gap-0.5 cursor-pointer hover:underline"
            style="color:#299f4d"
          >
            View all
            <ChevronRight :size="12" />
          </button>
        </header>

        <ul class="p-5 space-y-3">
          <li
            v-for="prop in properties"
            :key="prop.id"
            class="rounded-xl p-4 border transition-all hover:border-slate-300 cursor-pointer"
            style="border-color:#eef1f6"
          >
            <div class="flex items-start justify-between mb-2.5">
              <div class="min-w-0 pr-3">
                <p class="text-sm font-semibold truncate" style="color:#031a60">{{ prop.name }}</p>
                <p class="text-xs truncate" style="color:#a8adc1">{{ prop.address }}</p>
              </div>
              <p class="text-sm font-semibold shrink-0" style="color:#299f4d">
                {{ formatRWFCompact(prop.monthly_revenue) }}
              </p>
            </div>
            <div class="flex items-center justify-between mb-1.5 text-xs" style="color:#6b7294">
              <span>{{ prop.occupied }} / {{ prop.units }} occupied</span>
              <span class="font-semibold" style="color:#031a60">
                {{ Math.round((prop.occupied / prop.units) * 100) }}%
              </span>
            </div>
            <div class="h-1.5 rounded-full overflow-hidden" style="background:#f0f2f7">
              <div
                class="h-full rounded-full transition-all duration-500"
                :style="`width:${(prop.occupied / prop.units) * 100}%; background:${prop.occupied === prop.units ? '#299f4d' : '#031a60'}`"
              ></div>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- ── Row B: Recent activity + Leases ending ───────────────────────── -->
    <section class="grid grid-cols-1 lg:grid-cols-12 gap-6">

      <!-- Recent activity -->
      <div class="lg:col-span-7 rounded-2xl bg-white border" style="border-color:#e8eaf0">
        <header class="flex items-center justify-between px-5 py-4 border-b" style="border-color:#f0f2f7">
          <h2 class="text-sm font-bold" style="color:#031a60">Recent activity</h2>
        </header>
        <ul class="px-5 py-4 space-y-4">
          <li
            v-for="item in landlordPortfolio.recent_activity"
            :key="item.id"
            class="flex items-start gap-3"
          >
            <div
              class="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              :style="`background:${activityMeta[item.type].bg}; color:${activityMeta[item.type].color}`"
            >
              <component :is="activityMeta[item.type].icon" :size="15" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm font-semibold truncate" style="color:#031a60">
                  {{ item.title }}
                </p>
                <span
                  v-if="item.amount"
                  class="text-sm font-semibold shrink-0"
                  style="color:#299f4d"
                >
                  + {{ formatRWFCompact(item.amount) }}
                </span>
              </div>
              <p class="text-xs mt-0.5" style="color:#a8adc1">
                {{ item.subtitle }} · {{ relativeTime(item.timestamp) }}
              </p>
            </div>
          </li>
        </ul>
      </div>

      <!-- Leases ending soon -->
      <div class="lg:col-span-5 rounded-2xl bg-white border" style="border-color:#e8eaf0">
        <header class="flex items-center justify-between px-5 py-4 border-b" style="border-color:#f0f2f7">
          <div>
            <h2 class="text-sm font-bold" style="color:#031a60">Leases ending soon</h2>
            <p class="text-xs mt-0.5" style="color:#a8adc1">Next 60 days</p>
          </div>
        </header>
        <ul class="p-5 space-y-3">
          <li
            v-for="lease in landlordPortfolio.leases_ending"
            :key="lease.id"
            class="flex items-center gap-3 rounded-xl p-3 border"
            style="border-color:#eef1f6"
          >
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style="background:rgba(245,158,11,0.12); color:#b45309"
            >
              <CalendarClock :size="17" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold truncate" style="color:#031a60">
                {{ lease.tenant_name }}
              </p>
              <p class="text-xs truncate" style="color:#a8adc1">
                {{ lease.property_name }} · {{ lease.unit }}
              </p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-xs font-semibold" style="color:#b45309">
                {{ daysUntil(lease.lease_end) }}d left
              </p>
              <p class="text-xs" style="color:#a8adc1">
                {{ formatDateShort(lease.lease_end) }}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
