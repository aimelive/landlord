<script setup lang="ts">
import { X } from "lucide-vue-next";
import type { ActiveRole } from "../../../stores/auth.store";
import RolePickerCard from "./RolePickerCard.vue";

defineProps<{ open: boolean }>();

const emit = defineEmits<{
  (e: "pick", role: ActiveRole): void;
  (e: "close"): void;
}>();
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      style="background: rgba(3, 26, 96, 0.55); backdrop-filter: blur(6px)"
      @click.self="emit('close')"
    >
      <Transition
        enter-active-class="transition duration-250 ease-out"
        enter-from-class="opacity-0 translate-y-3 scale-[0.98]"
        enter-to-class="opacity-100 translate-y-0 scale-100"
      >
        <div v-if="open" class="relative">
          <button
            type="button"
            @click="emit('close')"
            aria-label="Close"
            class="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors hover:bg-slate-100"
          >
            <X :size="16" style="color: #6b7294" />
          </button>
          <RolePickerCard @pick="(role) => emit('pick', role)" />
        </div>
      </Transition>
    </div>
  </Transition>
</template>
