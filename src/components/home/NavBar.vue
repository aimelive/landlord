<script setup lang="ts">
import { ArrowRight } from "lucide-vue-next";
</script>

<template>
  <nav
    class="sticky top-0 z-30"
    v-motion
    :initial="{ opacity: 0, y: -24 }"
    :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
  >
    <div class="mx-4 mt-3">
      <div
        class="glass-light-strong max-w-6xl mx-auto rounded-2xl px-5 h-14 flex items-center justify-between gap-4"
      >
        <img src="/logo.png" alt="LandLord" class="h-7 w-auto shrink-0" />

        <div class="hidden sm:flex items-center gap-5">
          <a
            href="#features"
            class="text-xs font-medium transition-colors hover:text-ll-green"
            style="color: #a8adc1"
            >Features</a
          >
          <a
            href="#how-it-works"
            class="text-xs font-medium transition-colors hover:text-ll-green"
            style="color: #a8adc1"
            >How it works</a
          >
          <a
            href="#credit-score"
            class="text-xs font-medium transition-colors hover:text-ll-green"
            style="color: #a8adc1"
            >Credit Score</a
          >
          <a
            href="#contact"
            class="text-xs font-medium transition-colors hover:text-ll-green"
            style="color: #a8adc1"
            >Contact</a
          >
        </div>

        <div class="flex items-center gap-2">
          <router-link
            to="/login"
            class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:text-ll-navy focus-visible:outline-none"
            style="color: #a8adc1"
          >
            Log in
          </router-link>
          <router-link
            to="/signup"
            class="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style="background: #299f4d; --tw-ring-color: #299f4d"
          >
            Get started
            <ArrowRight :size="13" />
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>
