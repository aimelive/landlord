<script setup lang="ts">
import { computed } from 'vue'
import { CheckCircle2, Clock } from 'lucide-vue-next'

const props = defineProps<{
  variant: 'verified' | 'pending'
  /** Already-formatted date string to display in the subtitle. */
  dateLabel: string
}>()

const isVerified = computed(() => props.variant === 'verified')
</script>

<template>
  <section
    class="rounded-2xl border p-6 sm:p-8"
    :style="
      isVerified
        ? 'border-color:rgba(41,159,77,0.25); background: linear-gradient(135deg,#f0fbf4 0%,#e6f7eb 100%)'
        : 'border-color:rgba(245,158,11,0.3); background: linear-gradient(135deg,#fffaf0 0%,#fef3c7 100%)'
    "
  >
    <div class="flex flex-col sm:flex-row sm:items-center gap-5">
      <div
        class="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
        :style="
          isVerified
            ? 'background:#299f4d; box-shadow:0 8px 24px rgba(41,159,77,0.28)'
            : 'background:#f59e0b; box-shadow:0 8px 24px rgba(245,158,11,0.28)'
        "
      >
        <CheckCircle2 v-if="isVerified" :size="28" color="white" />
        <Clock v-else :size="28" color="white" />
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap mb-1">
          <h2 class="text-lg sm:text-xl font-bold" style="color: #031a60">
            {{ isVerified ? 'Identity verified' : 'Awaiting review' }}
          </h2>
          <span
            class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
            :style="
              isVerified
                ? 'background:#299f4d;color:white'
                : 'background:#f59e0b;color:white'
            "
          >
            <CheckCircle2 v-if="isVerified" :size="11" />
            <Clock v-else :size="11" />
            {{ isVerified ? 'Verified' : 'Pending' }}
          </span>
        </div>
        <p class="text-sm" style="color: #6b7294">
          <template v-if="isVerified">
            Verified on {{ dateLabel }} — your rental profile now carries a
            verified badge.
          </template>
          <template v-else>
            We received your ID on {{ dateLabel }}. Our team typically reviews
            submissions within one business day.
          </template>
        </p>
      </div>
    </div>
  </section>
</template>
