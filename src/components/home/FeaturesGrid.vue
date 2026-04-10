<script setup lang="ts">
import {
  CalendarDays,
  Bell,
  Building2,
  ShieldCheck,
  Star,
  MessageSquare,
  Sparkles,
  type LucideIcon,
} from "lucide-vue-next";

const features: {
  icon: LucideIcon;
  title: string;
  desc: string;
  span?: string;
}[] = [
  {
    icon: CalendarDays,
    title: "Payment & Coverage Tracking",
    desc: "Every rent payment is mapped to the exact months it covers. Landlords record once, both parties see everything.",
    span: "sm:col-span-2",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    desc: "Automated reminders before rent is due. Overdue alerts when payments are missed.",
  },
  {
    icon: Star,
    title: "Tenant Credit Score",
    desc: "Every on-time payment builds a score. Late payments lower it. The score follows the tenant everywhere.",
  },
  {
    icon: Building2,
    title: "Property Management",
    desc: "Manage multiple properties from one dashboard. See who owes what and where the gaps are.",
    span: "sm:col-span-2",
  },
  {
    icon: MessageSquare,
    title: "Landlord-Tenant Communication",
    desc: "Send announcements, maintenance updates, or payment requests. Every message is logged.",
  },
  {
    icon: ShieldCheck,
    title: "Centralized Trust System",
    desc: "Payment history is verified. Tenants can't escape debts by switching landlords.",
  },
];
</script>

<template>
  <section id="features" class="relative py-20 overflow-hidden">
    <div
      class="mesh-orb mesh-orb-1"
      style="top: 10%; left: -10%; opacity: 0.5"
    ></div>
    <div
      class="mesh-orb mesh-orb-3"
      style="bottom: 5%; right: -5%; opacity: 0.4"
    ></div>
    <div class="absolute inset-0 bg-dots-light opacity-50"></div>
    <div class="scan-line"></div>

    <div class="relative max-w-6xl mx-auto px-4">
      <div
        class="text-center mb-12"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 500 } }"
      >
        <span
          class="glass-light inline-flex items-center gap-2 text-xs font-semibold rounded-full px-4 py-2 mb-4 gradient-border-animated"
        >
          <Sparkles :size="12" style="color: #299f4d" />
          <span style="color: #299f4d">Platform Features</span>
        </span>
        <h2
          class="text-3xl sm:text-4xl font-extrabold tracking-tight text-gradient-navy"
        >
          More than a ledger.<br class="hidden sm:block" />
          A complete rental ecosystem.
        </h2>
        <p class="mt-3 text-sm max-w-lg mx-auto" style="color: #6b7294">
          Payment tracking, smart reminders, tenant credit scores, and
          property management — all in one platform.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          v-for="(feat, i) in features"
          :key="feat.title"
          class="bg-white rounded-2xl p-6 card-3d shimmer-light group gradient-border"
          :class="feat.span ?? ''"
          v-motion
          :initial="{ opacity: 0, y: 40 }"
          :visibleOnce="{
            opacity: 1,
            y: 0,
            transition: { duration: 500, delay: i * 70 },
          }"
        >
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center mb-4 icon-float transition-all group-hover:scale-110 group-hover:shadow-lg"
            style="--tw-shadow-color: rgba(41, 159, 77, 0.15)"
          >
            <component :is="feat.icon" :size="19" style="color: #299f4d" />
          </div>
          <h3 class="text-sm font-bold mb-1.5" style="color: #031a60">
            {{ feat.title }}
          </h3>
          <p class="text-sm leading-relaxed" style="color: #6b7294">
            {{ feat.desc }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
