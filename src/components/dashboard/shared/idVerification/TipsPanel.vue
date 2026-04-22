<script setup lang="ts">
import { Lightbulb, Lock } from 'lucide-vue-next'
</script>

<template>
  <section class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div
      class="rounded-2xl border p-5"
      style="border-color: #e8eaf0; background: white"
    >
      <div class="flex items-center gap-2 mb-3">
        <div
          class="w-8 h-8 rounded-lg flex items-center justify-center"
          style="background: rgba(245, 158, 11, 0.12)"
        >
          <Lightbulb :size="15" color="#b45309" />
        </div>
        <h3 class="text-sm font-bold" style="color: #031a60">For a clean scan</h3>
      </div>
      <ul class="space-y-1.5 text-xs" style="color: #6b7294">
        <li class="flex gap-2">
          <span style="color: #299f4d" class="mt-0.5">•</span>
          <span>Use natural daylight; avoid flash and shadows.</span>
        </li>
        <li class="flex gap-2">
          <span style="color: #299f4d" class="mt-0.5">•</span>
          <span>Remove the card from any wallet or sleeve.</span>
        </li>
        <li class="flex gap-2">
          <span style="color: #299f4d" class="mt-0.5">•</span>
          <span>Fill the frame — all four corners must be visible.</span>
        </li>
        <li class="flex gap-2">
          <span style="color: #299f4d" class="mt-0.5">•</span>
          <span>Keep the card flat — avoid glare and bends.</span>
        </li>
      </ul>
    </div>

    <div
      class="rounded-2xl border p-5"
      style="border-color: #e8eaf0; background: white"
    >
      <div class="flex items-center gap-2 mb-3">
        <div
          class="w-8 h-8 rounded-lg flex items-center justify-center"
          style="background: rgba(41, 159, 77, 0.12)"
        >
          <Lock :size="15" color="#1a7038" />
        </div>
        <h3 class="text-sm font-bold" style="color: #031a60">Your data is safe</h3>
      </div>
      <ul class="space-y-1.5 text-xs" style="color: #6b7294">
        <li class="flex gap-2">
          <span style="color: #299f4d" class="mt-0.5">•</span>
          <span>Images are encrypted in transit to our servers.</span>
        </li>
        <li class="flex gap-2">
          <span style="color: #299f4d" class="mt-0.5">•</span>
          <span>We use your ID only to verify identity.</span>
        </li>
        <li class="flex gap-2">
          <span style="color: #299f4d" class="mt-0.5">•</span>
          <span>We never share it with other tenants or landlords.</span>
        </li>
        <li class="flex gap-2">
          <span style="color: #299f4d" class="mt-0.5">•</span>
          <span>You can request deletion at any time via support.</span>
        </li>
      </ul>
    </div>
  </section>
</template>
