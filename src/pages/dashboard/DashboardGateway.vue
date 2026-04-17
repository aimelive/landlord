<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore, type ActiveRole } from "../../stores/auth.store";
import { useSeo } from "../../composables/useSeo";
import RolePickerCard from "../../components/dashboard/shared/RolePickerCard.vue";

useSeo({ title: "Choose your role", noindex: true });

const router = useRouter();
const auth = useAuthStore();

function pick(role: ActiveRole) {
  auth.setActiveRole(role);
  router.replace(`/dashboard/${role}`);
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center px-4 py-8 font-sans bg-white"
  >
    <RolePickerCard @pick="pick" />
  </div>
</template>
