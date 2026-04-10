<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { useSeo } from '../../composables/useSeo'
import DashboardTopbar from '../../components/dashboard/layout/DashboardTopbar.vue'
import DashboardSidebar from '../../components/dashboard/layout/DashboardSidebar.vue'

// Dashboard is private — keep all sub-pages out of search index
useSeo({
  title: 'Tenant Dashboard',
  description: 'Your private LandLord tenant dashboard — payment history, coverage timeline, and rental credit score.',
  canonical: 'https://landlord.aimelive.com/dashboard',
  noindex: true,
})

const sidebarOpen = ref(false)
</script>

<template>
  <div class="min-h-screen font-sans" style="background:#f0f2f6">
    <DashboardTopbar
      :sidebar-open="sidebarOpen"
      @toggle-sidebar="sidebarOpen = !sidebarOpen"
    />
    <DashboardSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <div class="pt-16 lg:pl-24 min-h-screen">
      <RouterView />
    </div>
  </div>
</template>
