<script setup lang="ts">
import { computed } from "vue";
import {
  Banknote,
  Receipt,
  CalendarCheck2,
  CalendarClock,
  TrendingUp,
  ArrowUpRight,
} from "lucide-vue-next";
import { rentLedger } from "../../../data/rentTransactions";
import {
  formatMoney,
  totalPaid,
  uniqueCoveredMonths,
  lastCoveredMonth,
  monthToLongLabel,
} from "../../../lib/ledger";

const payments = rentLedger.payments;
const total = computed(() => totalPaid(payments));
const months = computed(() => uniqueCoveredMonths(payments));
const last = computed(() => lastCoveredMonth(months.value));
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
    <!-- Total Paid - navy hero -->
    <div
      class="relative overflow-hidden rounded-2xl p-5 col-span-1 sm:col-span-2 xl:col-span-1"
      style="
        background: linear-gradient(
          135deg,
          #031a60 0%,
          #0a2580 60%,
          #1035a0 100%
        );
        box-shadow: 0 8px 32px rgba(3, 26, 96, 0.28);
      "
    >
      <!-- Orb -->
      <div
        class="absolute -top-8 -right-8 w-36 h-36 rounded-full pointer-events-none"
        style="
          background: radial-gradient(
            circle,
            rgba(41, 159, 77, 0.25) 0%,
            transparent 70%
          );
        "
      ></div>
      <div
        class="absolute bottom-0 left-0 w-24 h-24 rounded-full pointer-events-none"
        style="
          background: radial-gradient(
            circle,
            rgba(91, 138, 245, 0.15) 0%,
            transparent 70%
          );
        "
      ></div>

      <div class="relative z-10">
        <div class="flex items-center justify-between mb-4">
          <div
            class="w-9 h-9 rounded-xl flex items-center justify-center"
            style="background: rgba(255, 255, 255, 0.12)"
          >
            <Banknote :size="16" color="white" />
          </div>
          <span
            class="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
            style="background: rgba(41, 159, 77, 0.2); color: #4fd87c"
          >
            <TrendingUp :size="10" />
            +12%
          </span>
        </div>
        <div class="text-2xl font-bold text-white leading-tight">
          {{ formatMoney(total, rentLedger.currency) }}
        </div>
        <div
          class="text-xs mt-1.5 font-medium"
          style="color: rgba(255, 255, 255, 0.45)"
        >
          Total Paid So Far
        </div>
        <div class="text-xs mt-0.5" style="color: rgba(255, 255, 255, 0.3)">
          Across {{ payments.length }} payments
        </div>
      </div>
    </div>

    <!-- Number of Payments -->
    <div
      class="bg-white rounded-2xl p-5 border transition-all hover:shadow-md group"
      style="
        border-color: #e8eaf0;
        box-shadow: 0 2px 12px rgba(3, 26, 96, 0.06);
      "
    >
      <div class="flex items-center justify-between mb-4">
        <div
          class="w-9 h-9 rounded-xl flex items-center justify-center"
          style="background: rgba(3, 26, 96, 0.07)"
        >
          <Receipt :size="16" style="color: #031a60" />
        </div>
        <ArrowUpRight
          :size="14"
          style="color: #dce1e9"
          class="transition-colors group-hover:text-[#031a60]"
          :style="'color:#dce1e9'"
        />
      </div>
      <div class="text-2xl font-bold leading-tight" style="color: #031a60">
        {{ payments.length }}
      </div>
      <div class="text-xs mt-1.5 font-semibold" style="color: #6b7294">
        Number of Payments
      </div>
      <div class="text-xs mt-0.5" style="color: #a8adc1">
        Recorded transactions
      </div>
    </div>

    <!-- Covered Months - green accent -->
    <div
      class="bg-white rounded-2xl p-5 border transition-all hover:shadow-md group"
      style="
        border-color: #e8eaf0;
        box-shadow: 0 2px 12px rgba(3, 26, 96, 0.06);
      "
    >
      <div class="flex items-center justify-between mb-4">
        <div
          class="w-9 h-9 rounded-xl flex items-center justify-center"
          style="background: rgba(41, 159, 77, 0.1)"
        >
          <CalendarCheck2 :size="16" style="color: #299f4d" />
        </div>
        <!-- Mini progress bar -->
        <div class="flex flex-col items-end gap-0.5">
          <span class="text-xs font-semibold" style="color: #299f4d">100%</span>
          <div
            class="w-12 h-1.5 rounded-full overflow-hidden"
            style="background: #e8eaf0"
          >
            <div
              class="h-full rounded-full"
              style="background: #299f4d; width: 100%"
            ></div>
          </div>
        </div>
      </div>
      <div class="text-2xl font-bold leading-tight" style="color: #299f4d">
        {{ months.length }}
      </div>
      <div class="text-xs mt-1.5 font-semibold" style="color: #6b7294">
        Covered Months
      </div>
      <div class="text-xs mt-0.5" style="color: #a8adc1">
        Unique months covered
      </div>
    </div>

    <!-- Last Covered Month -->
    <div
      class="bg-white rounded-2xl p-5 border transition-all hover:shadow-md"
      style="
        border-color: #e8eaf0;
        box-shadow: 0 2px 12px rgba(3, 26, 96, 0.06);
      "
    >
      <div class="flex items-center justify-between mb-4">
        <div
          class="w-9 h-9 rounded-xl flex items-center justify-center"
          style="background: rgba(3, 26, 96, 0.07)"
        >
          <CalendarClock :size="16" style="color: #031a60" />
        </div>
        <span
          class="text-xs font-semibold px-2 py-1 rounded-full"
          style="background: rgba(3, 26, 96, 0.06); color: #031a60"
        >
          Active
        </span>
      </div>
      <div class="text-xl font-bold leading-tight" style="color: #031a60">
        {{ monthToLongLabel(last) }}
      </div>
      <div class="text-xs mt-1.5 font-semibold" style="color: #6b7294">
        Last Covered Month
      </div>
      <div class="text-xs mt-0.5" style="color: #a8adc1">
        Coverage end point
      </div>
    </div>
  </div>
</template>
