<script setup lang="ts">
import { Mail } from "lucide-vue-next";
import FieldMsg from "./FieldMsg.vue";

const model = defineModel<string | undefined>();

withDefaults(
  defineProps<{
    /** vee-validate's `xxxProps` object - passed through to the native input */
    fieldProps?: Record<string, unknown>;
    error?: string;
    label?: string;
    placeholder?: string;
    autocomplete?: string;
  }>(),
  {
    label: "Email address",
    placeholder: "info@landlord.rw",
    autocomplete: "email",
  },
);

const NORMAL_STYLE =
  "background:#f0f2f7;color:#031a60;--tw-ring-color:rgba(3,26,96,0.15)";
const ERROR_STYLE =
  "background:rgba(239,68,68,0.06);color:#031a60;" +
  "box-shadow:inset 0 0 0 1px rgba(239,68,68,0.45);" +
  "--tw-ring-color:rgba(239,68,68,0.25)";
</script>

<template>
  <div>
    <label class="block text-xs font-semibold mb-1.5" style="color: #1a2847">{{
      label
    }}</label>
    <div class="relative">
      <Mail
        :size="15"
        class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style="color: #a8adc1"
      />
      <input
        v-model="model"
        v-bind="fieldProps"
        type="email"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        class="w-full pl-9 pr-4 py-3 text-sm rounded-xl border-0 outline-none transition-all focus:ring-2"
        :style="error ? ERROR_STYLE : NORMAL_STYLE"
      />
    </div>
    <FieldMsg :show="!!error" class="mt-1">{{ error }}</FieldMsg>
  </div>
</template>
