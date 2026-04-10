<script setup lang="ts">
import { CheckCircle2, ArrowRight } from "lucide-vue-next";
</script>

<template>
  <section class="relative py-16 overflow-hidden">
    <div
      class="mesh-orb mesh-orb-1"
      style="top: -30%; left: 20%; opacity: 0.35"
    ></div>
    <div
      class="mesh-orb mesh-orb-3"
      style="bottom: -20%; right: 15%; opacity: 0.3"
    ></div>

    <div class="relative max-w-4xl mx-auto px-4">
      <div
        class="relative bg-white rounded-3xl px-6 sm:px-12 py-14 text-center overflow-hidden gradient-border-animated"
        style="
          box-shadow:
            0 12px 48px rgba(3, 26, 96, 0.08),
            0 4px 16px rgba(41, 159, 77, 0.06);
        "
        v-motion
        :initial="{ opacity: 0, y: 40 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 600 } }"
      >
        <div
          class="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full blur-2xl"
          style="background: rgba(41, 159, 77, 0.06)"
        ></div>
        <div
          class="pointer-events-none absolute -bottom-12 -left-12 w-40 h-40 rounded-full blur-2xl"
          style="background: rgba(3, 26, 96, 0.05)"
        ></div>

        <div class="relative z-10">
          <div
            class="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5 icon-float"
          >
            <CheckCircle2 :size="22" style="color: #299f4d" />
          </div>

          <h2
            class="text-2xl sm:text-3xl font-extrabold mb-2"
            style="color: #031a60"
          >
            Ready to modernize your rental management?
          </h2>
          <p class="text-sm mb-8 max-w-lg mx-auto" style="color: #6b7294">
            Join landlords across Rwanda who are switching from notebooks to
            LandLord. Free to start. No credit card required. Set up in under
            2 minutes.
          </p>

          <div class="flex flex-wrap gap-3 justify-center">
            <router-link
              to="/signup"
              class="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95 focus-visible:outline-none glow-green-light"
              style="background: #299f4d"
            >
              Start for free
              <ArrowRight :size="15" />
            </router-link>
            <router-link
              to="/login"
              class="glass-light inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all hover:shadow-md gradient-border"
              style="color: #031a60"
            >
              Log in
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
