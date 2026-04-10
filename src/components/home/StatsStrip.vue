<script setup lang="ts">
const stats = [
  { value: "100%", label: "Transparency" },
  { value: "0", label: "Payment disputes" },
  { value: "2min", label: "Setup time" },
  { value: "24/7", label: "Platform access" },
];
</script>

<template>
  <section class="relative py-16 overflow-hidden">
    <div
      class="mesh-orb"
      style="
        width: 300px;
        height: 300px;
        top: -20%;
        left: 60%;
        background: radial-gradient(
          circle,
          rgba(41, 159, 77, 0.08) 0%,
          transparent 70%
        );
        filter: blur(60px);
        animation: meshDrift 14s ease-in-out infinite;
      "
    ></div>
    <div class="scan-line"></div>

    <div
      class="relative max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-4"
    >
      <div
        v-for="(stat, i) in stats"
        :key="stat.label"
        class="bg-white rounded-2xl p-5 text-center card-lift shimmer-light"
        :class="i === 0 ? 'gradient-border-animated' : 'gradient-border'"
        v-motion
        :initial="{ opacity: 0, y: 24 }"
        :visibleOnce="{
          opacity: 1,
          y: 0,
          transition: { duration: 400, delay: i * 100 },
        }"
      >
        <div
          class="text-2xl sm:text-3xl font-extrabold"
          style="color: #031a60"
        >
          {{ stat.value }}
        </div>
        <div class="text-xs mt-1 font-medium" style="color: #a8adc1">
          {{ stat.label }}
        </div>
      </div>
    </div>
  </section>
</template>
