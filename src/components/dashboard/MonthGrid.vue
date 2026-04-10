<script setup lang="ts">
import { computed } from 'vue'
import { CheckCircle2 } from 'lucide-vue-next'
import { rentLedger } from '../../data/rentTransactions'
import {
  uniqueCoveredMonths,
  buildMonthCoverageIndex,
  monthToLabel,
  formatMoney,
  formatDate
} from '../../lib/ledger'

type Payment = (typeof rentLedger.payments)[number]

const props = defineProps<{
  selectedPayment: Payment | null
  filterYear: string
}>()

const emit = defineEmits<{
  (e: 'select-payment', payment: Payment): void
}>()

const payments = rentLedger.payments
const allMonths = computed(() => uniqueCoveredMonths(payments))
const coverageIndex = computed(() => buildMonthCoverageIndex(payments))

const filteredMonths = computed(() =>
  props.filterYear === 'All'
    ? allMonths.value
    : allMonths.value.filter(m => m.startsWith(props.filterYear))
)

function isSelected(month: string): boolean {
  if (!props.selectedPayment) return false
  return (props.selectedPayment.coveredMonths as readonly string[]).includes(month)
}

function handleClick(month: string) {
  const payment = coverageIndex.value.get(month)
  if (payment) emit('select-payment', payment)
}
</script>

<template>
  <div class="bg-white rounded-2xl p-5 mb-7 shadow-sm border" style="border-color:#dce1e9">

    <div v-if="filteredMonths.length === 0"
         class="text-center py-10 text-sm" style="color:#a8adc1">
      No months for this filter.
    </div>

    <div v-else class="grid gap-2.5 grid-cols-[repeat(auto-fill,minmax(130px,1fr))]">
      <div
        v-for="month in filteredMonths"
        :key="month"
        class="rounded-xl p-3 cursor-pointer transition-all outline-none border-2
               hover:-translate-y-px hover:shadow-sm
               focus-visible:ring-2 focus-visible:ring-offset-2"
        :style="isSelected(month)
          ? 'border-color:#031a60; background:rgba(3,26,96,0.06); box-shadow:0 0 0 3px rgba(3,26,96,0.12)'
          : 'border-color:#dce1e9; background:#f7f8fb'"
        tabindex="0"
        :aria-label="`${monthToLabel(month)} – covered`"
        @click="handleClick(month)"
        @keydown.enter="handleClick(month)"
        @keydown.space.prevent="handleClick(month)"
      >
        <!-- Month name -->
        <div class="text-sm font-semibold mb-1.5" style="color:#031a60">
          {{ monthToLabel(month) }}
        </div>

        <!-- Covered badge — brand green with Lucide check icon -->
        <div
          class="inline-flex items-center gap-1 text-xs font-semibold rounded-full px-2 py-0.5 mb-1.5 border"
          style="background:rgba(41,159,77,0.1); color:#299f4d; border-color:rgba(41,159,77,0.3)"
        >
          <CheckCircle2 :size="11" />
          Covered
        </div>

        <!-- Payment meta -->
        <template v-if="coverageIndex.get(month)">
          <div class="text-xs leading-snug" style="color:#a8adc1">
            Paid {{ formatDate(coverageIndex.get(month)!.paidOn) }}
          </div>
          <div class="text-xs font-semibold mt-0.5" style="color:#031a60">
            {{ formatMoney(coverageIndex.get(month)!.amount, rentLedger.currency) }}
          </div>
        </template>
      </div>
    </div>

  </div>
</template>
