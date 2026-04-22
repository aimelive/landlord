<script setup lang="ts">
import { computed } from 'vue'
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from 'lucide-vue-next'
import {
  dismiss,
  pause,
  resume,
  useToastState,
  type Toast,
  type ToastVariant,
} from '../lib/toast'

const state = useToastState()

// Newest first in DOM so it gets the entering animation; the stack is top-down,
// so newest ends up at the top — nearest the top-right corner.
const items = computed(() => [...state.items].reverse())

type Tokens = {
  bg: string
  border: string
  iconBg: string
  iconColor: string
  progress: string
}

const tokens: Record<ToastVariant, Tokens> = {
  success: {
    bg: '#ffffff',
    border: 'rgba(41,159,77,0.28)',
    iconBg: 'rgba(41,159,77,0.12)',
    iconColor: '#1a7038',
    progress: '#299f4d',
  },
  error: {
    bg: '#ffffff',
    border: 'rgba(239,68,68,0.28)',
    iconBg: 'rgba(239,68,68,0.10)',
    iconColor: '#b91c1c',
    progress: '#dc2626',
  },
  info: {
    bg: '#ffffff',
    border: 'rgba(3,26,96,0.18)',
    iconBg: 'rgba(3,26,96,0.08)',
    iconColor: '#031a60',
    progress: '#031a60',
  },
  warning: {
    bg: '#ffffff',
    border: 'rgba(245,158,11,0.32)',
    iconBg: 'rgba(245,158,11,0.12)',
    iconColor: '#b45309',
    progress: '#f59e0b',
  },
}

function iconFor(variant: ToastVariant) {
  switch (variant) {
    case 'success':
      return CheckCircle2
    case 'error':
      return AlertCircle
    case 'warning':
      return AlertTriangle
    case 'info':
    default:
      return Info
  }
}

function onAction(t: Toast) {
  try {
    t.action?.onClick()
  } finally {
    dismiss(t.id)
  }
}
</script>

<template>
  <div class="toast-host" role="region" aria-label="Notifications">
    <TransitionGroup name="toast" tag="div" class="toast-stack">
      <div
        v-for="t in items"
        :key="t.id"
        class="toast"
        :class="'toast--' + t.variant"
        role="status"
        :aria-live="t.variant === 'error' ? 'assertive' : 'polite'"
        @pointerenter="pause(t.id)"
        @pointerleave="resume(t.id)"
        @focusin="pause(t.id)"
        @focusout="resume(t.id)"
        :style="{
          '--toast-border': tokens[t.variant].border,
          '--toast-bg': tokens[t.variant].bg,
        } as Record<string, string>"
      >
        <!-- Variant-colored glow bar along the left edge -->
        <div
          class="toast-edge"
          :style="{ background: tokens[t.variant].progress }"
        />

        <div class="toast-body">
          <div
            class="toast-icon"
            :style="{
              background: tokens[t.variant].iconBg,
              color: tokens[t.variant].iconColor,
            }"
          >
            <component :is="iconFor(t.variant)" :size="16" />
          </div>

          <div class="toast-content">
            <p class="toast-title">{{ t.title }}</p>
            <p v-if="t.description" class="toast-description">
              {{ t.description }}
            </p>
            <button
              v-if="t.action"
              type="button"
              @click="onAction(t)"
              class="toast-action"
              :style="{ color: tokens[t.variant].progress }"
            >
              {{ t.action.label }}
            </button>
          </div>

          <button
            type="button"
            class="toast-close"
            aria-label="Dismiss notification"
            @click="dismiss(t.id)"
          >
            <X :size="13" />
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-host {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 100;
  width: calc(100vw - 48px);
  max-width: 380px;
  pointer-events: none;
}

.toast-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
}

.toast {
  position: relative;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  background: var(--toast-bg);
  border: 1px solid var(--toast-border);
  border-radius: 14px;
  box-shadow:
    0 10px 30px rgba(3, 26, 96, 0.12),
    0 2px 6px rgba(3, 26, 96, 0.06);
  overflow: hidden;
  backdrop-filter: blur(8px);
}

.toast-edge {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  opacity: 0.85;
}

.toast-body {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 12px 12px 14px;
}

.toast-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-size: 13.5px;
  font-weight: 700;
  color: #031a60;
  line-height: 1.25;
  word-wrap: break-word;
}

.toast-description {
  font-size: 12.5px;
  color: #6b7294;
  line-height: 1.4;
  margin-top: 2px;
}

.toast-action {
  margin-top: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  background: transparent;
  border: none;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.toast-close {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  color: #a8adc1;
  background: transparent;
  border: none;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.toast-close:hover {
  background: rgba(3, 26, 96, 0.06);
  color: #031a60;
}

/* ── Enter / leave / move ────────────────────────────────── */
.toast-enter-from {
  opacity: 0;
  transform: translateX(110%) scale(0.96);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(120%) scale(0.9);
}
.toast-enter-active {
  transition:
    opacity 0.28s ease,
    transform 0.38s cubic-bezier(0.22, 1.2, 0.36, 1);
}
.toast-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.26s cubic-bezier(0.4, 0, 1, 1);
  /* Remove from flow so surviving toasts slide down smoothly. */
  position: absolute;
  right: 0;
  left: 0;
}
.toast-move {
  transition: transform 0.32s cubic-bezier(0.33, 1, 0.68, 1);
}

/* ── Accessibility / mobile ──────────────────────────────── */
@media (max-width: 520px) {
  .toast-host {
    top: 16px;
    right: 16px;
    left: 16px;
    width: auto;
    max-width: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .toast-enter-active,
  .toast-leave-active,
  .toast-move {
    transition: opacity 0.2s ease;
  }
  .toast-enter-from,
  .toast-leave-to {
    transform: none;
  }
}
</style>
