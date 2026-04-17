<script setup lang="ts">
import { Bell } from 'lucide-vue-next'
</script>

<template>
  <div class="max-w-3xl rounded-2xl bg-white border p-8 text-center" style="border-color:#e2e5ed">
    <div class="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style="background:#6b7294">
      <Bell :size="22" color="white" />
    </div>
    <h1 class="text-xl font-bold mb-1" style="color:#031a60">Notifications</h1>
    <p class="text-sm" style="color:#6b7294">Your notifications will appear here.</p>
  </div>
</template>
