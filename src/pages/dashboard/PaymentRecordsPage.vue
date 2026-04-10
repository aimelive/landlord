<script setup lang="ts">
import { ref, computed } from 'vue'
import { FileText, CheckCircle2, RefreshCw } from 'lucide-vue-next'
import { rentLedger } from '../../data/rentTransactions'
import {
  uniqueCoveredMonths,
  lastCoveredMonth,
  coverageStatusMessage,
} from '../../lib/ledger'

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
</script>

<template>
  <main class="max-w-6xl mx-auto px-4 py-8 pb-12">

    <!-- Page header -->
    <div class="flex items-start gap-4 mb-8">
      <div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
           style="background:rgba(3,26,96,0.08)">
        <FileText :size="20" style="color:#031a60" />
      </div>
      <div>
        <h1 class="text-xl font-bold tracking-tight" style="color:#031a60">Payment Records</h1>
        <p class="text-sm mt-0.5" style="color:#a8adc1">Full history of all your rent payments and covered periods</p>
        <span class="inline-flex items-center gap-1.5 mt-2 text-xs font-medium rounded-full px-3 py-1 border"
              style="background:rgba(3,26,96,0.05); border-color:rgba(3,26,96,0.15); color:#031a60">
          <RefreshCw :size="11" style="color:#299f4d" />
          {{ payments.length }} total payments recorded
        </span>
      </div>
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

    <!-- Payments Table -->
    <PaymentsTable :payments="filteredPayments" :selected-payment="selectedPayment"
                   @select="(p) => selectedPayment = p" />

    <!-- Empty state -->
    <div v-if="filteredPayments.length === 0"
         class="bg-white rounded-2xl border p-10 text-center"
         style="border-color:#dce1e9">
      <FileText :size="32" style="color:#dce1e9" class="mx-auto mb-3" />
      <p class="text-sm font-medium" style="color:#6b7294">No payments found for {{ selectedYear }}</p>
      <p class="text-xs mt-1" style="color:#a8adc1">Try selecting a different year or "All"</p>
    </div>

  </main>

  <!-- Payment Detail Drawer -->
  <PaymentDetail v-if="selectedPayment" :payment="selectedPayment"
                 @close="selectedPayment = null" />
</template>
