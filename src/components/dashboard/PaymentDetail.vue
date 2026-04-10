<script setup lang="ts">
import { X, ArrowRight, CalendarDays, Banknote } from 'lucide-vue-next'
import { rentLedger } from '../../data/rentTransactions'
import { formatMoney, formatDate } from '../../lib/ledger'

type Payment = (typeof rentLedger.payments)[number]

defineProps<{
  payment: Payment
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex justify-end"
    style="background:rgba(4,9,30,0.45); backdrop-filter:blur(2px)"
    @click.self="emit('close')"
  >
    <div
      class="bg-white w-full max-w-sm md:max-w-md h-full overflow-y-auto shadow-2xl flex flex-col animate-slide-in"
      role="dialog"
      aria-modal="true"
      aria-label="Payment Details"
    >

      <!-- Panel header -->
      <div class="panel-header-bg shrink-0 px-5 py-5 flex justify-between items-start">
        <div class="flex items-center gap-3">
          <span class="logo-capsule"><img src="/logo.png" alt="LandLord" class="h-6 w-auto" /></span>
          <div>
            <h2 class="text-sm font-bold text-white tracking-tight">Payment Details</h2>
            <div class="flex items-center gap-1 text-xs mt-0.5" style="color:#a8adc1">
              <CalendarDays :size="11" />
              Paid on {{ formatDate(payment.paidOn) }}
            </div>
          </div>
        </div>

        <button
          class="ml-2 shrink-0 w-7 h-7 rounded-full border cursor-pointer
                 flex items-center justify-center transition-all"
          style="background:rgba(255,255,255,0.1); border-color:rgba(255,255,255,0.15); color:#dce1e9"
          @mouseenter="($event.currentTarget as HTMLElement).style.background='#299f4d'"
          @mouseleave="($event.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.1)'"
          @click="emit('close')"
          aria-label="Close panel"
        >
          <X :size="14" />
        </button>
      </div>

      <!-- Body -->
      <div class="p-5 flex-1">

        <!-- Amount -->
        <div class="flex items-center gap-2 mb-1">
          <Banknote :size="20" style="color:#031a60" />
          <div class="text-3xl font-bold" style="color:#031a60">
            {{ formatMoney(payment.amount, rentLedger.currency) }}
          </div>
        </div>
        <div class="text-sm italic mb-6" style="color:#a8adc1">{{ payment.notes }}</div>

        <!-- Section label -->
        <div class="text-xs font-semibold uppercase tracking-wider mb-3" style="color:#a8adc1">
          Effect of this payment
        </div>

        <!-- Covered periods -->
        <ul class="space-y-2 mb-6 list-none p-0">
          <li
            v-for="period in payment.coveredPeriods"
            :key="period.label"
            class="flex items-start gap-3 px-3 py-2.5 rounded-xl border"
            style="background:#f7f8fb; border-color:#dce1e9"
          >
            <span
              class="mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
              style="background:rgba(41,159,77,0.15)"
            >
              <CalendarDays :size="11" style="color:#299f4d" />
            </span>
            <div>
              <div class="font-semibold text-sm" style="color:#031a60">{{ period.label }}</div>
              <div class="flex items-center gap-1 text-xs mt-0.5" style="color:#a8adc1">
                {{ formatDate(period.start) }}
                <ArrowRight :size="10" class="shrink-0" />
                {{ formatDate(period.end) }}
              </div>
            </div>
          </li>
        </ul>

        <!-- Coverage count -->
        <div class="flex items-center gap-3 rounded-xl px-4 py-3 border"
             style="background:rgba(3,26,96,0.04); border-color:rgba(3,26,96,0.12)">
          <span class="text-2xl font-bold" style="color:#031a60">{{ payment.coveredPeriods.length }}</span>
          <span class="text-sm" style="color:#1a2847">
            month{{ (payment.coveredPeriods.length as number) !== 1 ? 's' : '' }} covered by this payment.
          </span>
        </div>

      </div>
    </div>
  </div>
</template>
