<script setup lang="ts">
import { ref } from "vue";
import { ChevronDown, ChevronUp, ArrowRight } from "lucide-vue-next";
import { rentLedger } from "../../../data/rentTransactions";
import { formatMoney, formatDate, monthToLabel } from "../../../lib/ledger";

type Payment = (typeof rentLedger.payments)[number];

const props = defineProps<{
  payments: readonly Payment[];
  selectedPayment: Payment | null;
}>();

const emit = defineEmits<{
  (e: "select", payment: Payment): void;
}>();

const expandedRows = ref<Set<number>>(new Set());

function togglePeriods(index: number) {
  if (expandedRows.value.has(index)) {
    expandedRows.value.delete(index);
  } else {
    expandedRows.value.add(index);
  }
}

function isRowSelected(payment: Payment): boolean {
  return props.selectedPayment?.paidOn === payment.paidOn;
}
</script>

<template>
  <div class="mb-7">
    <!-- Section header -->
    <div class="flex items-center mb-3">
      <div class="flex items-center gap-2 font-semibold" style="color: #031a60">
        <span
          class="w-3 h-3 rounded-sm inline-block"
          style="background: #299f4d"
        ></span>
        Payment Records
      </div>
    </div>

    <!-- Table card -->
    <div
      class="bg-white rounded-2xl shadow-sm overflow-hidden border"
      style="border-color: #dce1e9"
    >
      <div class="overflow-x-auto">
        <table class="w-full border-collapse min-w-140">
          <!-- Head - navy brand colour -->
          <thead>
            <tr
              style="
                background: linear-gradient(135deg, #04091e 0%, #031a60 100%);
              "
            >
              <th
                class="text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 whitespace-nowrap"
                style="color: #a8adc1"
              >
                Paid On
              </th>
              <th
                class="text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 whitespace-nowrap"
                style="color: #a8adc1"
              >
                Amount
              </th>
              <th
                class="text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 whitespace-nowrap"
                style="color: #a8adc1"
              >
                Notes
              </th>
              <th
                class="text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 whitespace-nowrap"
                style="color: #a8adc1"
              >
                Months Covered
              </th>
              <th
                class="text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 whitespace-nowrap"
                style="color: #a8adc1"
              >
                Covered Periods
              </th>
            </tr>
          </thead>

          <!-- Body -->
          <tbody>
            <template v-if="payments.length === 0">
              <tr>
                <td
                  colspan="5"
                  class="text-center py-10 text-sm"
                  style="color: #a8adc1"
                >
                  No payments for this filter.
                </td>
              </tr>
            </template>
            <template v-else>
              <tr
                v-for="(payment, i) in payments"
                :key="payment.paidOn"
                class="border-b last:border-b-0 cursor-pointer transition-colors focus-visible:outline-none"
                :style="
                  isRowSelected(payment)
                    ? 'background:rgba(3,26,96,0.06); border-color:#dce1e9'
                    : 'background:white; border-color:#dce1e9'
                "
                tabindex="0"
                :aria-selected="isRowSelected(payment)"
                @click="emit('select', payment)"
                @keydown.enter="emit('select', payment)"
                @mouseenter="
                  (e) => {
                    if (!isRowSelected(payment))
                      (e.currentTarget as HTMLElement).style.background =
                        'rgba(3,26,96,0.03)';
                  }
                "
                @mouseleave="
                  (e) => {
                    if (!isRowSelected(payment))
                      (e.currentTarget as HTMLElement).style.background =
                        'white';
                  }
                "
              >
                <td
                  class="px-4 py-3 text-sm align-top whitespace-nowrap"
                  style="color: #1a2847"
                >
                  {{ formatDate(payment.paidOn) }}
                </td>
                <td
                  class="px-4 py-3 text-sm font-semibold align-top whitespace-nowrap"
                  style="color: #031a60"
                >
                  {{ formatMoney(payment.amount, rentLedger.currency) }}
                </td>
                <td class="px-4 py-3 text-sm align-top" style="color: #a8adc1">
                  {{ payment.notes }}
                </td>
                <td class="px-4 py-3 align-top">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="m in payment.coveredMonths"
                      :key="m"
                      class="text-xs rounded px-1.5 py-0.5 whitespace-nowrap border"
                      style="
                        background: #f0f2f6;
                        border-color: #dce1e9;
                        color: #1a2847;
                      "
                      >{{ monthToLabel(m) }}</span
                    >
                  </div>
                </td>
                <td class="px-4 py-3 align-top">
                  <button
                    class="flex items-center gap-1.5 text-xs cursor-pointer bg-transparent border-0 font-sans p-0 transition-colors font-medium"
                    style="color: #031a60"
                    @click.stop="togglePeriods(i)"
                    @mouseenter="
                      ($event.currentTarget as HTMLElement).style.color =
                        '#299f4d'
                    "
                    @mouseleave="
                      ($event.currentTarget as HTMLElement).style.color =
                        '#031a60'
                    "
                    :aria-expanded="expandedRows.has(i)"
                  >
                    <component
                      :is="expandedRows.has(i) ? ChevronUp : ChevronDown"
                      :size="13"
                    />
                    {{ expandedRows.has(i) ? "Hide" : "Show" }} periods
                  </button>
                  <ul
                    v-if="expandedRows.has(i)"
                    class="mt-1.5 space-y-1 list-none p-0"
                  >
                    <li
                      v-for="period in payment.coveredPeriods"
                      :key="period.label"
                      class="text-xs pl-2 border-l-2 flex items-baseline gap-1"
                      style="color: #a8adc1; border-color: #299f4d"
                    >
                      <strong style="color: #1a2847">{{ period.label }}</strong>
                      <ArrowRight
                        :size="10"
                        class="shrink-0 inline"
                        style="color: #a8adc1"
                      />
                      {{ formatDate(period.start) }} →
                      {{ formatDate(period.end) }}
                    </li>
                  </ul>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
