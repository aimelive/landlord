<script setup lang="ts">
import { X, CheckCircle2 } from "lucide-vue-next";

const oldWay = [
  "Handwritten notebooks & paper receipts",
  '"Did I pay March?" — constant confusion',
  "Chasing tenants for overdue rent",
  "No way to verify a new tenant's history",
  "Verbal agreements, no paper trail",
];
const newWay = [
  "Digital dashboard with full payment history",
  "Every payment mapped to exact months covered",
  "Automated reminders & overdue alerts",
  "Credit score verification before signing a lease",
  "Every transaction and message logged forever",
];
</script>

<template>
  <section class="relative py-12 overflow-hidden">
    <div class="absolute inset-0 bg-dots-light opacity-20"></div>

    <div class="relative max-w-4xl mx-auto px-4">
      <div
        class="text-center mb-8"
        v-motion
        :initial="{ opacity: 0, y: 24 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 500 } }"
      >
        <h2
          class="text-2xl sm:text-3xl font-extrabold tracking-tight"
          style="color: #031a60"
        >
          From notebooks to
          <span class="text-gradient-green">one source of truth</span>
        </h2>
      </div>

      <div
        class="grid grid-cols-1 sm:grid-cols-2 gap-4"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visibleOnce="{
          opacity: 1,
          y: 0,
          transition: { duration: 600, delay: 100 },
        }"
      >
        <!-- Old way -->
        <div
          class="bg-white rounded-2xl p-6 border"
          style="border-color: rgba(220, 38, 38, 0.12)"
        >
          <div class="flex items-center gap-2 mb-4">
            <span
              class="w-8 h-8 rounded-lg flex items-center justify-center"
              style="background: rgba(220, 38, 38, 0.06)"
            >
              <X :size="14" style="color: #dc2626" />
            </span>
            <span class="text-sm font-bold" style="color: #dc2626"
              >Without LandLord</span
            >
          </div>
          <ul class="space-y-2.5">
            <li
              v-for="item in oldWay"
              :key="item"
              class="flex items-start gap-2.5"
            >
              <X
                :size="13"
                class="shrink-0 mt-0.5"
                style="color: rgba(220, 38, 38, 0.4)"
              />
              <span class="text-sm leading-relaxed" style="color: #6b7294">{{
                item
              }}</span>
            </li>
          </ul>
        </div>

        <!-- New way -->
        <div
          class="bg-white rounded-2xl p-6 gradient-border-animated glow-green-border-light"
        >
          <div class="flex items-center gap-2 mb-4">
            <span
              class="w-8 h-8 rounded-lg flex items-center justify-center"
              style="background: rgba(41, 159, 77, 0.08)"
            >
              <CheckCircle2 :size="14" style="color: #299f4d" />
            </span>
            <span class="text-sm font-bold" style="color: #299f4d"
              >With LandLord</span
            >
          </div>
          <ul class="space-y-2.5">
            <li
              v-for="item in newWay"
              :key="item"
              class="flex items-start gap-2.5"
            >
              <CheckCircle2
                :size="13"
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
