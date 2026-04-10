<script setup lang="ts">
import { ref, computed } from 'vue'
import { RefreshCw, CheckCircle2 } from 'lucide-vue-next'
import { rentLedger } from '../../data/rentTransactions'
import {
  uniqueCoveredMonths,
  lastCoveredMonth,
  coverageStatusMessage,
  monthToLongLabel,
} from '../../lib/ledger'

import MonthGrid from '../../components/dashboard/MonthGrid.vue'
import PaymentsTable from '../../components/dashboard/PaymentsTable.vue'
import PaymentDetail from '../../components/dashboard/PaymentDetail.vue'
import YearFilter from '../../components/dashboard/YearFilter.vue'
import SummaryCards from '../../components/dashboard/SummaryCards.vue'

type Payment = (typeof rentLedger.payments)[number]

const payments = rentLedger.payments
const allMonths = computed(() => uniqueCoveredMonths(payments))
const lastMonth = computed(() => lastCoveredMonth(allMonths.value))
const statusMessage = computed(() => coverageStatusMessage(lastMonth.value))

const availableYears = computed(() => {
  const years = new Set<string>()
  for (const p of payments) years.add(p.paidOn.slice(0, 4))
  return [...years].sort()
})

const selectedYear = ref('All')
const filteredPayments = computed(() =>
  selectedYear.value === 'All'
    ? payments
    : payments.filter((p) => p.paidOn.startsWith(selectedYear.value))
)

const selectedPayment = ref<Payment | null>(null)
const tableRef = ref<HTMLElement | null>(null)

function selectPayment(payment: Payment) {
  selectedPayment.value = payment
}
function closeDetail() {
  selectedPayment.value = null
}
function onMonthSelect(payment: Payment) {
  selectedPayment.value = payment
  tableRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <main class="max-w-6xl mx-auto px-4 py-8 pb-12">

    <!-- Welcome banner -->
    <div class="relative overflow-hidden rounded-2xl px-6 py-5 mb-8"
         style="background: linear-gradient(135deg, #031a60 0%, #0a2580 60%, #1035a0 100%);
                box-shadow: 0 8px 32px rgba(3,26,96,0.22)">
      <div class="absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none"
           style="background:radial-gradient(circle, rgba(41,159,77,0.2) 0%, transparent 70%)"></div>
      <div class="absolute bottom-0 left-1/2 w-64 h-32 pointer-events-none"
           style="background:radial-gradient(circle, rgba(91,138,245,0.12) 0%, transparent 70%)"></div>

      <div class="relative z-10 flex items-center justify-between flex-wrap gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-widest mb-1"
             style="color:rgba(255,255,255,0.45)">Tenant Dashboard</p>
          <h1 class="text-2xl font-bold text-white leading-tight">Good morning, Jean 👋</h1>
          <p class="text-sm mt-1" style="color:rgba(255,255,255,0.6)">
            Your rent coverage is up to date · Last covered {{ monthToLongLabel(lastMonth) }}
          </p>
        </div>
        <div class="flex flex-col items-center px-4 py-2.5 rounded-xl"
             style="background:rgba(255,255,255,0.1)">
          <span class="text-xl font-bold text-white">88</span>
          <span class="text-xs font-medium mt-0.5" style="color:rgba(255,255,255,0.6)">Credit Score</span>
          <span class="text-xs font-semibold mt-0.5" style="color:#4fd87c">Excellent</span>
        </div>
      </div>
    </div>

    <!-- Page heading -->
    <div class="mb-6">
      <h2 class="text-xl font-bold tracking-tight" style="color:#031a60">Rent Transactions</h2>
      <p class="text-sm mt-0.5" style="color:#a8adc1">Payment history and month-by-month coverage</p>
      <span class="inline-flex items-center gap-1.5 mt-2 text-xs font-medium rounded-full px-3 py-1 border"
            style="background:rgba(3,26,96,0.05); border-color:rgba(3,26,96,0.15); color:#031a60">
        <RefreshCw :size="11" style="color:#299f4d" />
        Coverage cycle: 28 → 28 monthly periods
      </span>
    </div>

    <!-- Summary Cards -->
    <SummaryCards />

    <!-- Coverage Status Banner -->
    <div class="flex items-start gap-3 bg-white border rounded-xl px-4 py-3.5 mb-7 text-sm shadow-sm"
         style="border-color:#dce1e9; border-left:4px solid #299f4d; color:#1a2847"
         role="status" aria-live="polite">
      <span class="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
            style="background:#299f4d">
        <CheckCircle2 :size="12" color="white" />
      </span>
      <span>{{ statusMessage }}</span>
    </div>

    <!-- Year Filter -->
    <YearFilter :years="availableYears" :selected="selectedYear"
                @change="(y) => { selectedYear = y }" />

    <!-- Coverage Timeline -->
    <div class="flex items-center gap-2 font-semibold mb-3" style="color:#031a60">
      <CheckCircle2 :size="16" style="color:#299f4d" />
      Coverage Timeline
    </div>
    <MonthGrid :selected-payment="selectedPayment" :filter-year="selectedYear"
               @select-payment="onMonthSelect" />

    <!-- Payments Table -->
    <div ref="tableRef">
      <PaymentsTable :payments="filteredPayments" :selected-payment="selectedPayment"
                     @select="selectPayment" />
    </div>

  </main>

  <!-- Payment Detail Drawer — fixed overlay, unaffected by nesting -->
  <PaymentDetail v-if="selectedPayment" :payment="selectedPayment" @close="closeDetail" />
</template>
