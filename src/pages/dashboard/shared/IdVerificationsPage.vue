<script setup lang="ts">
import { ShieldCheck } from 'lucide-vue-next'
</script>

<template>
  <div class="max-w-3xl rounded-2xl bg-white border p-8 text-center" style="border-color:#e2e5ed">
    <div class="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style="background:#299f4d">
      <ShieldCheck :size="22" color="white" />
    </div>
    <h1 class="text-xl font-bold mb-1" style="color:#031a60">ID verifications</h1>
    <p class="text-sm" style="color:#6b7294">Verify your identity so landlords can trust your rental history.</p>
  </div>
</template>
