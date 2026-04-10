<script setup lang="ts">
import { Home, Eye, TrendingUp, Zap, type LucideIcon } from "lucide-vue-next";

const steps: {
  num: string;
  title: string;
  desc: string;
  icon: LucideIcon;
}[] = [
  {
    num: "01",
    title: "Register your properties",
    desc: "Landlords add properties and invite tenants. Setup takes under 2 minutes.",
    icon: Home,
  },
  {
    num: "02",
    title: "Track payments & send reminders",
    desc: "Record payments as they come in. The system auto-maps coverage and flags overdue balances.",
    icon: Eye,
  },
  {
    num: "03",
    title: "Build trust across the ecosystem",
    desc: "Every payment builds a tenant credit score. Landlords verify tenants before renting.",
    icon: TrendingUp,
  },
];
</script>

<template>
  <section id="how-it-works" class="relative py-20 overflow-hidden">
    <div class="absolute inset-0 bg-grid-light"></div>
    <div
      class="mesh-orb mesh-orb-2"
      style="top: -15%; left: 30%; opacity: 0.4"
    ></div>
    <div class="scan-line"></div>

    <div class="relative max-w-4xl mx-auto px-4">
      <div
        class="text-center mb-14"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 500 } }"
      >
        <span
          class="glass-light inline-flex items-center gap-2 text-xs font-semibold rounded-full px-4 py-2 mb-4 gradient-border-animated"
        >
          <Zap :size="12" style="color: #299f4d" />
          <span style="color: #299f4d">How it works</span>
        </span>
        <h2
          class="text-3xl sm:text-4xl font-extrabold tracking-tight"
          style="color: #031a60"
        >
          Three steps to a
          <span class="text-gradient-green">smarter rental.</span>
        </h2>
      </div>

      <div class="relative grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
        <div
          class="hidden sm:block absolute top-12 left-[16.67%] right-[16.67%] h-px"
          style="
            background: linear-gradient(
              90deg,
              rgba(41, 159, 77, 0.05),
              rgba(41, 159, 77, 0.3),
              rgba(41, 159, 77, 0.05)
            );
          "
        ></div>

        <div
          v-for="(step, i) in steps"
          :key="step.num"
          class="flex flex-col items-center text-center"
          v-motion
          :initial="{ opacity: 0, y: 40 }"
          :visibleOnce="{
            opacity: 1,
            y: 0,
            transition: { duration: 500, delay: i * 120 },
          }"
        >
          <div class="relative mb-5">
            <div
              class="w-14 h-14 rounded-full flex items-center justify-center text-lg font-extrabold bg-white transition-all"
              :class="
                i === 0
                  ? 'pulse-ring gradient-border-animated'
                  : 'gradient-border'
              "
              style="color: #299f4d"
            >
              {{ step.num }}
            </div>
          </div>

          <div
            class="bg-white rounded-2xl p-5 w-full card-3d shimmer-light gradient-border"
          >
            <div
              class="w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-3 icon-float-navy"
            >
              <component :is="step.icon" :size="17" style="color: #031a60" />
            </div>
            <h3 class="text-sm font-bold mb-1.5" style="color: #031a60">
              {{ step.title }}
            </h3>
            <p class="text-xs leading-relaxed" style="color: #6b7294">
              {{ step.desc }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
