<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import {
  CheckCircle2,
  Bell,
  Building2,
  TrendingUp,
  MoveRight,
} from "lucide-vue-next";

/* ── Rotating headline words ── */
const rotatingWords = [
  "transparent.",
  "accountable.",
  "connected.",
  "informed.",
];
const currentWordIdx = ref(0);
let wordTimer: ReturnType<typeof setInterval> | undefined;

/* ── Delayed hero notification popup ── */
const showNotif = ref(false);

onMounted(() => {
  wordTimer = setInterval(() => {
    currentWordIdx.value = (currentWordIdx.value + 1) % rotatingWords.length;
  }, 3000);
  setTimeout(() => {
    showNotif.value = true;
  }, 3500);
});

onUnmounted(() => {
  if (wordTimer) clearInterval(wordTimer);
});
</script>

<template>
  <section class="relative overflow-hidden">
    <!-- Background -->
    <div class="absolute inset-0" style="background: #f7f8fc"></div>
    <div class="mesh-orb-xl-green" style="top: -15%; left: -10%"></div>
    <div class="mesh-orb-xl-navy" style="top: 0%; right: -12%"></div>
    <div class="mesh-orb-xl-blue" style="bottom: -5%; left: 40%"></div>
    <div class="mesh-orb mesh-orb-4" style="bottom: 10%; left: 10%"></div>
    <div class="absolute inset-0 bg-dots-light"></div>
    <div class="scan-line"></div>

    <!-- Particles -->
    <div
      class="particle particle-1 w-2 h-2"
      style="
        top: 12%;
        left: 8%;
        background: #299f4d;
        opacity: 0.5;
        box-shadow: 0 0 20px rgba(41, 159, 77, 0.4);
      "
    ></div>
    <div
      class="particle particle-2 w-1.5 h-1.5"
      style="
        top: 22%;
        right: 12%;
        background: #031a60;
        opacity: 0.3;
        box-shadow: 0 0 16px rgba(3, 26, 96, 0.3);
      "
    ></div>
    <div
      class="particle particle-3 w-2.5 h-2.5"
      style="
        top: 55%;
        left: 5%;
        background: rgba(79, 216, 124, 0.5);
        box-shadow: 0 0 24px rgba(79, 216, 124, 0.3);
      "
    ></div>
    <div
      class="particle particle-4 w-1.5 h-1.5"
      style="
        top: 65%;
        right: 8%;
        background: #5b8af5;
        opacity: 0.4;
        box-shadow: 0 0 18px rgba(91, 138, 245, 0.4);
      "
    ></div>

    <!-- ── Floating preview cards (desktop only) ── -->
    <div class="hidden lg:block">
      <!-- Card 1: Payment received -->
      <div class="absolute float-card-1 z-10" style="top: 22%; left: 2.5%">
        <div
          class="glass-light-strong rounded-2xl p-4 shadow-xl"
          style="width: 220px"
        >
          <div class="flex items-center gap-2 mb-2">
            <span
              class="w-8 h-8 rounded-lg flex items-center justify-center"
              style="background: rgba(41, 159, 77, 0.1)"
            >
              <CheckCircle2 :size="14" style="color: #299f4d" />
            </span>
            <span class="text-xs font-bold" style="color: #031a60"
              >Payment Received</span
            >
          </div>
          <div class="text-lg font-extrabold" style="color: #031a60">
            200,000
            <span class="text-[10px] font-semibold" style="color: #a8adc1"
              >Rwf</span
            >
          </div>
          <div class="flex items-center gap-1.5 mt-1.5">
            <span
              class="w-1.5 h-1.5 rounded-full pulse-dot"
              style="background: #299f4d"
            ></span>
            <span class="text-[10px]" style="color: #a8adc1"
              >J. Mugisha · just now</span
            >
          </div>
        </div>
      </div>

      <!-- Card 2: Credit score -->
      <div class="absolute float-card-2 z-10" style="top: 15%; right: 2.5%">
        <div
          class="glass-light-strong rounded-2xl p-4 shadow-xl"
          style="width: 195px"
        >
          <div
            class="text-[10px] font-semibold uppercase tracking-wider mb-2"
            style="color: #a8adc1"
          >
            Credit Score
          </div>
          <div class="flex items-center gap-3">
            <div class="relative" style="width: 48px; height: 48px">
              <svg viewBox="0 0 48 48" class="w-full h-full">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="rgba(3,26,96,0.06)"
                  stroke-width="4"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="#299f4d"
                  stroke-width="4"
                  stroke-dasharray="126"
                  stroke-dashoffset="15"
                  stroke-linecap="round"
                  transform="rotate(-90 24 24)"
                />
              </svg>
              <span
                class="absolute inset-0 flex items-center justify-center text-xs font-extrabold"
                style="color: #299f4d"
                >92</span
              >
            </div>
            <div>
              <div class="text-xs font-bold" style="color: #031a60">
                Excellent
              </div>
              <div class="text-[10px]" style="color: #a8adc1">Top 15%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 3: Rent reminder -->
      <div class="absolute float-card-3 z-10" style="bottom: 20%; left: 1.5%">
        <div
          class="glass-light-strong rounded-2xl p-3.5 shadow-xl"
          style="width: 215px"
        >
          <div class="flex items-center gap-2.5">
            <span
              class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style="background: rgba(245, 158, 11, 0.1)"
            >
              <Bell :size="14" style="color: #f59e0b" />
            </span>
            <div>
              <div class="text-xs font-bold" style="color: #031a60">
                Rent Reminder
              </div>
              <div class="text-[10px]" style="color: #a8adc1">
                Due in 3 days · 150,000 Rwf
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 4: Properties -->
      <div class="absolute float-card-4 z-10" style="bottom: 22%; right: 2%">
        <div
          class="glass-light-strong rounded-2xl p-4 shadow-xl"
          style="width: 205px"
        >
          <div class="flex items-center gap-2 mb-2.5">
            <span
              class="w-8 h-8 rounded-lg flex items-center justify-center"
              style="background: rgba(3, 26, 96, 0.06)"
            >
              <Building2 :size="14" style="color: #031a60" />
            </span>
            <span class="text-xs font-bold" style="color: #031a60"
              >3 Properties</span
            >
          </div>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="p in ['Kigali Heights', 'Nyamirambo', 'Kimironko']"
              :key="p"
              class="text-[9px] px-2 py-0.5 rounded-full font-medium"
              style="background: rgba(3, 26, 96, 0.04); color: #6b7294"
              >{{ p }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- ── Delayed notification popup ── -->
    <Transition name="notif">
      <div
        v-if="showNotif"
        class="absolute bottom-12 right-6 z-20 hidden lg:block"
      >
        <div
          class="glass-light-strong rounded-2xl p-3.5 shadow-2xl gradient-border-animated"
          style="width: 270px"
        >
          <div class="flex items-start gap-2.5">
            <span
              class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style="background: rgba(41, 159, 77, 0.1)"
            >
              <TrendingUp :size="15" style="color: #299f4d" />
            </span>
            <div>
              <div class="text-xs font-bold" style="color: #031a60">
                Credit Score Updated
              </div>
              <div class="text-[10px] mt-0.5" style="color: #6b7294">
                A. Uwimana's score improved to
                <strong style="color: #299f4d">88</strong>
              </div>
              <div class="flex items-center gap-1.5 mt-1">
                <span
                  class="w-1.5 h-1.5 rounded-full pulse-dot"
                  style="background: #299f4d"
                ></span>
                <span class="text-[10px]" style="color: #a8adc1"
                  >Just now</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── Hero content ── -->
    <div
      class="relative z-10 max-w-6xl mx-auto px-4 pt-24 sm:pt-32 pb-24 flex flex-col items-center text-center gap-6"
    >
      <!-- Badge pill -->
      <div
        v-motion
        :initial="{ opacity: 0, scale: 0.8 }"
        :enter="{
          opacity: 1,
          scale: 1,
          transition: { duration: 400, delay: 80 },
        }"
      >
        <span
          class="glass-light inline-flex items-center gap-2 text-xs font-semibold rounded-full px-4 py-2 gradient-border-animated"
        >
          <span
            class="w-1.5 h-1.5 rounded-full pulse-dot"
            style="background: #299f4d"
          ></span>
          <span style="color: #299f4d"
            >Rwanda's Digital Rent Management Platform</span
          >
        </span>
      </div>

      <!-- Headline with rotating word -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 40 }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: { duration: 600, delay: 160 },
        }"
      >
        <h1
          class="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight max-w-5xl"
          style="color: #031a60"
        >
          Manage rent. Build trust.<br />
          <span>Stay </span>
          <span
            class="inline-block overflow-hidden align-bottom"
            style="height: 1.15em"
          >
            <Transition name="word" mode="out-in">
              <span
                :key="currentWordIdx"
                class="text-gradient-flow inline-block"
                aria-live="polite"
              >
                {{ rotatingWords[currentWordIdx] }}
              </span>
            </Transition>
          </span>
        </h1>
      </div>

      <!-- Subtitle -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: { duration: 500, delay: 280 },
        }"
      >
        <p
          class="text-base sm:text-lg max-w-2xl leading-relaxed"
          style="color: #6b7294"
        >
          A centralized platform where landlords manage properties, track
          payments, send reminders, and collect debts — while tenants build a
          credit score that follows them everywhere. One source of truth.
        </p>
      </div>

      <!-- CTA buttons -->
      <div
        class="flex flex-wrap gap-3 justify-center"
        v-motion
        :initial="{ opacity: 0, y: 24 }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: { duration: 500, delay: 380 },
        }"
      >
        <router-link
          to="/signup"
          class="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 glow-green-light"
          style="background: #299f4d; --tw-ring-color: #299f4d"
        >
          Start for free
          <MoveRight :size="15" />
        </router-link>
        <router-link
          to="/login"
          class="glass-light inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all hover:shadow-md gradient-border focus-visible:outline-none focus-visible:ring-2"
          style="color: #031a60"
        >
          Log in
        </router-link>
      </div>
    </div>

    <div
      class="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
      style="background: linear-gradient(to bottom, transparent, #f7f8fc)"
    ></div>
  </section>
</template>
