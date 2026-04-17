<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { RouterView } from "vue-router";
import { useSeo } from "../../composables/useSeo";
import { useAuthStore } from "../../stores/auth.store";
import DashboardTopbar from "../../components/dashboard/layout/DashboardTopbar.vue";
import DashboardSidebar from "../../components/dashboard/layout/DashboardSidebar.vue";

const auth = useAuthStore();

const portalName = computed(() =>
  auth.activeRole === "landlord" ? "Landlord" : "Tenant",
);

// Dashboard is private — private pages stay out of search index.
useSeo({
  title: `${portalName.value} Dashboard`,
  description: `Your private LandLord ${portalName.value.toLowerCase()} dashboard - payment history, coverage timeline, and rental activity.`,
  canonical: "https://landlord.aimelive.com/dashboard",
  noindex: true,
});

// useSeo runs once at setup; keep the browser-tab title fresh when the user
// switches role via the sidebar (the layout instance is reused across
// /dashboard/landlord and /dashboard/tenant).
watch(portalName, (name) => {
  document.title = `${name} Dashboard | LandLord`;
});

const sidebarOpen = ref(false);
</script>

<template>
  <div class="min-h-screen font-sans" style="background: #f0f2f6">
    <DashboardTopbar
      :sidebar-open="sidebarOpen"
      @toggle-sidebar="sidebarOpen = !sidebarOpen"
    />
    <DashboardSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Reserve the sidebar's width on lg+, then centre content in a standard
         container. Pages just render their content; no page-level wrappers. -->
    <div class="pt-16 lg:pl-64 min-h-screen">
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
