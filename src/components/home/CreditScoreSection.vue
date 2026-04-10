<script setup lang="ts">
import { Star, AlertTriangle } from "lucide-vue-next";
</script>

<template>
  <section id="credit-score" class="relative py-20 overflow-hidden">
    <div class="absolute inset-0 bg-grid-light"></div>
    <div
      class="mesh-orb mesh-orb-4"
      style="top: -10%; left: 5%; opacity: 0.4"
    ></div>
    <div
      class="mesh-orb mesh-orb-2"
      style="bottom: -15%; right: -5%; opacity: 0.3"
    ></div>

    <div class="relative max-w-5xl mx-auto px-4">
      <div
        class="bg-white rounded-3xl overflow-hidden gradient-border-animated"
        style="box-shadow: 0 12px 48px rgba(3, 26, 96, 0.08)"
        v-motion
        :initial="{ opacity: 0, y: 40 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 600 } }"
      >
        <div class="grid grid-cols-1 lg:grid-cols-2">
          <!-- Left: content -->
          <div class="p-8 sm:p-12 flex flex-col justify-center">
            <span
              class="inline-flex items-center gap-2 text-xs font-semibold rounded-full px-3 py-1.5 mb-5 self-start"
              style="background: rgba(41, 159, 77, 0.08); color: #299f4d"
            >
              <Star :size="11" />
              Game-changing feature
            </span>
            <h2
              class="text-2xl sm:text-3xl font-extrabold mb-4"
              style="color: #031a60"
            >
              Tenant Credit Score
            </h2>
            <p class="text-sm leading-relaxed mb-4" style="color: #6b7294">
              Every on-time payment builds a tenant's credit score. Late or
              missed payments lower it. This score is
              <strong style="color: #031a60">permanent and portable</strong> —
              it follows the tenant across every property and every landlord
              in the system.
            </p>
            <p class="text-sm leading-relaxed mb-6" style="color: #6b7294">
              For <strong style="color: #031a60">landlords</strong>: verify a
              potential tenant's reliability before signing a lease. No more
              renting blind.
            </p>
            <p class="text-sm leading-relaxed" style="color: #6b7294">
              For <strong style="color: #031a60">tenants</strong>: your good
              payment history becomes an asset. A high score means better
              trust, faster approvals, and a reputation that opens doors.
            </p>

            <div
              class="flex items-center gap-2 mt-6 pt-5"
              style="border-top: 1px solid rgba(3, 26, 96, 0.06)"
            >
              <AlertTriangle :size="13" style="color: #f59e0b" />
              <p class="text-xs font-medium" style="color: #6b7294">
                Tenants can't escape debts by moving — their score follows
                them to every landlord.
              </p>
            </div>
          </div>

          <!-- Right: visual mock of credit score -->
          <div
            class="p-8 sm:p-12 flex items-center justify-center"
            style="background: linear-gradient(135deg, #031a60, #0d2b80)"
          >
            <div class="w-full max-w-xs text-center">
              <!-- Score circle -->
              <div
                class="relative mx-auto mb-6"
                style="width: 160px; height: 160px"
              >
                <svg class="w-full h-full" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    stroke-width="10"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="#299f4d"
                    stroke-width="10"
                    stroke-dasharray="395"
                    stroke-dashoffset="47"
                    stroke-linecap="round"
                    transform="rotate(-90 80 80)"
                    style="
                      filter: drop-shadow(0 0 8px rgba(41, 159, 77, 0.4));
                    "
                  />
                </svg>
                <div
                  class="absolute inset-0 flex flex-col items-center justify-center"
                >
                  <span class="text-4xl font-extrabold text-white">88</span>
                  <span
                    class="text-xs font-medium"
                    style="color: rgba(255, 255, 255, 0.5)"
                    >out of 100</span
                  >
                </div>
              </div>

              <h3 class="text-sm font-bold text-white mb-1">J. Mugisha</h3>
              <p class="text-xs mb-5" style="color: rgba(255, 255, 255, 0.4)">
                Tenant since Sep 2024
              </p>

              <!-- Score breakdown -->
              <div class="space-y-2.5 text-left">
                <div
                  v-for="item in [
                    { label: 'On-time payments', value: '18/20', pct: 90 },
                    { label: 'Months covered', value: '20', pct: 100 },
                    { label: 'Payment consistency', value: 'High', pct: 85 },
                  ]"
                  :key="item.label"
                >
                  <div class="flex justify-between text-xs mb-1">
                    <span style="color: rgba(255, 255, 255, 0.5)">{{
                      item.label
                    }}</span>
                    <span
                      class="font-semibold"
                      style="color: rgba(255, 255, 255, 0.7)"
                      >{{ item.value }}</span
                    >
                  </div>
                  <div
                    class="h-1.5 rounded-full"
                    style="background: rgba(255, 255, 255, 0.08)"
                  >
                    <div
                      class="h-full rounded-full"
                      :style="`width:${item.pct}%; background:#299f4d`"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
