<script setup lang="ts">
import { Building2, Users, CheckCircle2 } from "lucide-vue-next";

const landlordBenefits = [
  "See all tenants and properties in one dashboard",
  "Automated payment reminders — stop chasing rent",
  "Track debts and collect overdue payments easily",
  "Check a tenant's credit score before renting",
  "Send notifications and announcements instantly",
];
const tenantBenefits = [
  "Always know which months you've paid for",
  "Build a credit score with every on-time payment",
  "Receive reminders before rent is due",
  "Your good payment history follows you",
  "Communicate with your landlord transparently",
];
</script>

<template>
  <section class="relative py-16 overflow-hidden">
    <div class="absolute inset-0 bg-dots-light opacity-30"></div>
    <div
      class="mesh-orb mesh-orb-2"
      style="top: -20%; right: -10%; opacity: 0.3"
    ></div>

    <div class="relative max-w-6xl mx-auto px-4">
      <div
        class="text-center mb-10"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 500 } }"
      >
        <h2
          class="text-3xl sm:text-4xl font-extrabold tracking-tight text-gradient-navy"
        >
          Built for landlords.<br class="hidden sm:block" />
          Trusted by tenants.
        </h2>
        <p class="mt-3 text-sm max-w-lg mx-auto" style="color: #6b7294">
          One platform, two perspectives. Landlords get management tools.
          Tenants get transparency and a reputation that opens doors.
        </p>
      </div>

      <div
        class="grid grid-cols-1 sm:grid-cols-2 gap-5"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visibleOnce="{
          opacity: 1,
          y: 0,
          transition: { duration: 600, delay: 100 },
        }"
      >
        <!-- Landlord column -->
        <div
          class="bg-white rounded-2xl p-7 gradient-border card-3d"
          style="box-shadow: 0 4px 20px rgba(3, 26, 96, 0.04)"
        >
          <div class="flex items-center gap-3 mb-5">
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center icon-float-navy"
            >
              <Building2 :size="19" style="color: #031a60" />
            </div>
            <div>
              <h3 class="text-sm font-bold" style="color: #031a60">
                For Landlords & Property Managers
              </h3>
              <p class="text-xs" style="color: #a8adc1">
                Manage, notify, collect
              </p>
            </div>
          </div>
          <ul class="space-y-3">
            <li
              v-for="item in landlordBenefits"
              :key="item"
              class="flex items-start gap-2.5"
            >
              <CheckCircle2
                :size="14"
                class="shrink-0 mt-0.5"
                style="color: #299f4d"
              />
              <span class="text-sm leading-relaxed" style="color: #6b7294">{{
                item
              }}</span>
            </li>
          </ul>
        </div>

        <!-- Tenant column -->
        <div
          class="bg-white rounded-2xl p-7 gradient-border card-3d"
          style="box-shadow: 0 4px 20px rgba(3, 26, 96, 0.04)"
        >
          <div class="flex items-center gap-3 mb-5">
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center icon-float"
            >
              <Users :size="19" style="color: #299f4d" />
            </div>
            <div>
              <h3 class="text-sm font-bold" style="color: #031a60">
                For Tenants
              </h3>
              <p class="text-xs" style="color: #a8adc1">
                Track, build reputation, stay informed
              </p>
            </div>
          </div>
          <ul class="space-y-3">
            <li
              v-for="item in tenantBenefits"
              :key="item"
              class="flex items-start gap-2.5"
            >
              <CheckCircle2
                :size="14"
                class="shrink-0 mt-0.5"
                style="color: #299f4d"
              />
              <span class="text-sm leading-relaxed" style="color: #6b7294">{{
                item
              }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
