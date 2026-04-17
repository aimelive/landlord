<script setup lang="ts">
import { Check } from "lucide-vue-next";

const model = defineModel<boolean | undefined>({ required: true });

withDefaults(
  defineProps<{
    tone?: "navy" | "green";
    error?: boolean;
    disabled?: boolean;
    /** vee-validate's `xxxProps` object - passed through to the native input */
    fieldProps?: Record<string, unknown>;
  }>(),
  { tone: "navy" },
);
</script>

<template>
  <span
    class="cb-wrap"
    :class="[
      tone === 'green' ? 'cb-green' : 'cb-navy',
      { 'cb-error': error, 'cb-disabled': disabled },
    ]"
  >
    <input
      v-model="model"
      v-bind="fieldProps"
      :disabled="disabled"
      type="checkbox"
      class="cb-native"
    />
    <span class="cb-box" aria-hidden="true">
      <Check :size="11" class="cb-check" stroke-width="3.5" />
    </span>
  </span>
</template>

<style scoped>
.cb-wrap {
  position: relative;
  display: inline-flex;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

/* Native input sits on top, invisible, handles all interaction + a11y. */
.cb-native {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
}
.cb-native:disabled {
  cursor: not-allowed;
}

.cb-box {
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  border-radius: 4px;
  background: white;
  border: 1.5px solid #c7cedd;
  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.cb-check {
  color: white;
  opacity: 0;
  transform: scale(0.6);
  transition:
    opacity 0.14s ease,
    transform 0.22s cubic-bezier(0.33, 1, 0.68, 1);
}

/* Checked - tone-specific fill */
.cb-native:checked ~ .cb-box {
  border-color: transparent;
}
.cb-native:checked ~ .cb-box .cb-check {
  opacity: 1;
  transform: scale(1);
}
.cb-navy .cb-native:checked ~ .cb-box {
  background: #031a60;
}
.cb-green .cb-native:checked ~ .cb-box {
  background: #299f4d;
}

/* Focus ring */
.cb-navy .cb-native:focus-visible ~ .cb-box {
  box-shadow: 0 0 0 3px rgba(3, 26, 96, 0.18);
}
.cb-green .cb-native:focus-visible ~ .cb-box {
  box-shadow: 0 0 0 3px rgba(41, 159, 77, 0.2);
}

/* Error */
.cb-error .cb-box {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.04);
}
.cb-error .cb-native:focus-visible ~ .cb-box {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.18);
}

/* Hover - only on unchecked + enabled */
.cb-wrap:hover .cb-native:not(:checked):not(:disabled) ~ .cb-box {
  border-color: #8891a8;
  background: #f6f7fa;
}

/* Disabled */
.cb-disabled .cb-box {
  background: #f0f2f7;
  border-color: #dce1e9;
}
.cb-disabled .cb-check {
  color: #a8adc1;
}
</style>
