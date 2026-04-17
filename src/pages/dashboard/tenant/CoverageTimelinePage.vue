<script setup lang="ts">
import { ref, computed } from "vue";
import { CalendarRange, CheckCircle2, RefreshCw } from "lucide-vue-next";
import { rentLedger } from "../../../data/rentTransactions";
import {
  uniqueCoveredMonths,
  lastCoveredMonth,
  coverageStatusMessage,
  monthToLongLabel,
} from "../../../lib/ledger";

import MonthGrid from "../../../components/dashboard/tenant/MonthGrid.vue";
import PaymentDetail from "../../../components/dashboard/tenant/PaymentDetail.vue";
import YearFilter from "../../../components/dashboard/tenant/YearFilter.vue";
import SummaryCards from "../../../components/dashboard/tenant/SummaryCards.vue";

type Payment = (typeof rentLedger.payments)[number];

const payments = rentLedger.payments;
const allMonths = computed(() => uniqueCoveredMonths(payments));
const lastMonth = computed(() => lastCoveredMonth(allMonths.value));
const statusMessage = computed(() => coverageStatusMessage(lastMonth.value));

const availableYears = computed(() => {
  const years = new Set<string>();
  for (const p of payments) years.add(p.paidOn.slice(0, 4));
  return [...years].sort();
});

const selectedYear = ref("All");
const selectedPayment = ref<Payment | null>(null);
</script>

<template>
  <div>
    <!-- Page header -->
    <div class="flex items-start gap-4 mb-8">
      <div
        class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style="background: rgba(3, 26, 96, 0.08)"
      >
        <CalendarRange :size="20" style="color: #031a60" />
      </div>
      <div>
        <h1 class="text-xl font-bold tracking-tight" style="color: #031a60">
          Coverage Timeline
        </h1>
        <p class="text-sm mt-0.5" style="color: #a8adc1">
          Month-by-month view of your covered rent periods
        </p>
        <span
          class="inline-flex items-center gap-1.5 mt-2 text-xs font-medium rounded-full px-3 py-1 border"
          style="
            background: rgba(3, 26, 96, 0.05);
            border-color: rgba(3, 26, 96, 0.15);
            color: #031a60;
          "
        >
          <RefreshCw :size="11" style="color: #299f4d" />
          Coverage cycle: 28 → 28 monthly periods
        </span>
      </div>
    </div>

    <!-- Summary Cards -->
    <SummaryCards />

    <!-- Coverage Status Banner -->
    <div
      class="flex items-start gap-3 bg-white border rounded-xl px-4 py-3.5 mb-7 text-sm shadow-sm"
      style="
        border-color: #dce1e9;
        border-left: 4px solid #299f4d;
        color: #1a2847;
      "
      role="status"
      aria-live="polite"
    >
      <span
        class="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
        style="background: #299f4d"
      >
        <CheckCircle2 :size="12" color="white" />
      </span>
      <span>{{ statusMessage }}</span>
    </div>

    <!-- Year Filter -->
    <YearFilter
      :years="availableYears"
      :selected="selectedYear"
      @change="
        (y) => {
          selectedYear = y;
        }
      "
    />

    <!-- Timeline heading -->
    <div
      class="flex items-center gap-2 font-semibold mb-3"
      style="color: #031a60"
    >
      <CheckCircle2 :size="16" style="color: #299f4d" />
      {{
        selectedYear === "All"
          ? "All Covered Months"
          : `Covered Months - ${selectedYear}`
      }}
      <span
        class="ml-auto text-xs font-normal px-2 py-0.5 rounded-full"
        style="background: rgba(41, 159, 77, 0.1); color: #299f4d"
      >
        {{ allMonths.length }} months total
      </span>
    </div>

    <!-- Month Grid -->
    <MonthGrid
      :selected-payment="selectedPayment"
      :filter-year="selectedYear"
      @select-payment="(p) => (selectedPayment = p)"
    />

    <!-- Last covered callout -->
    <div class="flex items-center gap-2 mt-2 text-xs" style="color: #a8adc1">
      <CheckCircle2 :size="13" style="color: #299f4d" />
      Last covered month:
      <strong style="color: #031a60">{{ monthToLongLabel(lastMonth) }}</strong>
    </div>
  </div>

  <!-- Payment Detail Drawer -->
  <PaymentDetail
    v-if="selectedPayment"
    :payment="selectedPayment"
    @close="selectedPayment = null"
  />
</template>
