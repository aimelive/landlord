<script setup lang="ts">
defineProps<{
  active: boolean
}>()
</script>

<template>
  <Transition name="scan">
    <div v-if="active" class="scan-overlay" aria-hidden="true">
      <!-- Backdrop tint + drifting scan-line texture -->
      <div class="scan-tint" />
      <div class="scan-grid" />

      <!-- Edge rulers: measurement tick marks (left + right) -->
      <div class="scan-ruler scan-ruler--left" />
      <div class="scan-ruler scan-ruler--right" />

      <!-- Primary downward sweep (fast, bright green laser) -->
      <div class="scan-sweep scan-sweep--primary">
        <div class="scan-line scan-line--primary" />
      </div>

      <!-- Secondary upward verification sweep (slower, thinner, cool-cyan) -->
      <div class="scan-sweep scan-sweep--secondary">
        <div class="scan-line scan-line--secondary" />
      </div>

      <!-- Corner brackets — pulse + subtle extension -->
      <div class="scan-bracket scan-bracket--tl" />
      <div class="scan-bracket scan-bracket--tr" />
      <div class="scan-bracket scan-bracket--bl" />
      <div class="scan-bracket scan-bracket--br" />

      <!-- Status chip (top-left) -->
      <div class="scan-hud scan-hud--chip">
        <span class="scan-hud-dot" />
        <span>ANALYZING</span>
      </div>

      <!-- Cycling readout (top-right): OCR / match progress -->
      <div class="scan-hud scan-hud--readout">
        <span class="scan-readout-item">OCR · 24%</span>
        <span class="scan-readout-item">OCR · 58%</span>
        <span class="scan-readout-item">OCR · 81%</span>
        <span class="scan-readout-item">OCR · 96%</span>
      </div>

      <!-- Bottom progress track -->
      <div class="scan-progress">
        <div class="scan-progress-fill" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.scan-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  border-radius: inherit;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

/* ── Backdrop ─────────────────────────────────────────────── */
.scan-tint {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(3, 26, 96, 0.18) 0%,
    rgba(3, 26, 96, 0.38) 100%
  );
}

.scan-grid {
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    0deg,
    rgba(74, 222, 128, 0.09) 0px,
    rgba(74, 222, 128, 0.09) 1px,
    transparent 1px,
    transparent 4px
  );
  mix-blend-mode: screen;
  opacity: 0.7;
  animation: scan-grid-drift 0.5s linear infinite;
  will-change: transform;
}

@keyframes scan-grid-drift {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(4px);
  }
}

/* ── Edge rulers ─────────────────────────────────────────── */
.scan-ruler {
  position: absolute;
  top: 14%;
  bottom: 14%;
  width: 10px;
  opacity: 0.5;
  background-image: repeating-linear-gradient(
    to bottom,
    rgba(74, 222, 128, 0.7) 0px,
    rgba(74, 222, 128, 0.7) 1px,
    transparent 1px,
    transparent 7px
  );
}
.scan-ruler--left {
  left: 10px;
}
.scan-ruler--right {
  right: 10px;
}

/* ── Sweeps ──────────────────────────────────────────────── */
.scan-sweep {
  position: absolute;
  left: 0;
  right: 0;
  will-change: transform;
}

.scan-sweep--primary {
  top: 0;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(41, 159, 77, 0) 0%,
    rgba(41, 159, 77, 0.02) 55%,
    rgba(41, 159, 77, 0.2) 85%,
    rgba(74, 222, 128, 0.42) 97%,
    rgba(74, 222, 128, 0.78) 100%
  );
  animation: scan-sweep-down 1.15s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.scan-sweep--secondary {
  bottom: 0;
  height: 45%;
  background: linear-gradient(
    to top,
    rgba(59, 130, 246, 0) 0%,
    rgba(59, 130, 246, 0.06) 80%,
    rgba(147, 197, 253, 0.32) 100%
  );
  animation: scan-sweep-up 1.8s ease-in-out infinite;
}

@keyframes scan-sweep-down {
  0% {
    transform: translateY(-100%);
  }
  82%,
  100% {
    transform: translateY(0%);
  }
}

@keyframes scan-sweep-up {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(-120%);
  }
}

.scan-line {
  position: absolute;
  left: 0;
  right: 0;
}

.scan-line--primary {
  bottom: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    rgba(74, 222, 128, 0) 0%,
    rgba(74, 222, 128, 0.95) 8%,
    #d1fae5 50%,
    rgba(74, 222, 128, 0.95) 92%,
    rgba(74, 222, 128, 0) 100%
  );
  box-shadow:
    0 0 10px rgba(74, 222, 128, 1),
    0 0 24px rgba(41, 159, 77, 0.75);
}

.scan-line--secondary {
  top: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(147, 197, 253, 0) 0%,
    rgba(147, 197, 253, 0.85) 50%,
    rgba(147, 197, 253, 0) 100%
  );
  box-shadow: 0 0 8px rgba(147, 197, 253, 0.8);
}

/* ── Corner brackets ─────────────────────────────────────── */
.scan-bracket {
  position: absolute;
  width: 24px;
  height: 24px;
  border-color: #4ade80;
  border-style: solid;
  border-width: 0;
  animation: scan-bracket-pulse 0.9s ease-in-out infinite alternate;
  filter: drop-shadow(0 0 4px rgba(74, 222, 128, 0.7));
}
.scan-bracket--tl {
  top: 12px;
  left: 12px;
  border-top-width: 2px;
  border-left-width: 2px;
  border-top-left-radius: 4px;
  transform-origin: top left;
}
.scan-bracket--tr {
  top: 12px;
  right: 12px;
  border-top-width: 2px;
  border-right-width: 2px;
  border-top-right-radius: 4px;
  transform-origin: top right;
}
.scan-bracket--bl {
  bottom: 12px;
  left: 12px;
  border-bottom-width: 2px;
  border-left-width: 2px;
  border-bottom-left-radius: 4px;
  transform-origin: bottom left;
}
.scan-bracket--br {
  bottom: 12px;
  right: 12px;
  border-bottom-width: 2px;
  border-right-width: 2px;
  border-bottom-right-radius: 4px;
  transform-origin: bottom right;
}

@keyframes scan-bracket-pulse {
  0% {
    opacity: 0.55;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1.08);
  }
}

/* ── HUD pills ───────────────────────────────────────────── */
.scan-hud {
  position: absolute;
  top: 16px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #d1fae5;
  background: rgba(3, 26, 96, 0.72);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(74, 222, 128, 0.45);
  border-radius: 4px;
}

.scan-hud--chip {
  left: 44px;
}
.scan-hud--readout {
  right: 44px;
  min-width: 84px;
  height: 22px;
  padding: 0;
  justify-content: center;
  position: absolute;
  overflow: hidden;
}

.scan-hud-dot {
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: #4ade80;
  box-shadow: 0 0 8px rgba(74, 222, 128, 0.9);
  animation: scan-blink 0.5s ease-in-out infinite alternate;
}

@keyframes scan-blink {
  0% {
    opacity: 0.35;
    transform: scale(0.85);
  }
  100% {
    opacity: 1;
    transform: scale(1.1);
  }
}

/* Readout: 4 stacked lines, each visible for a quarter of the cycle. */
.scan-readout-item {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  animation: scan-readout-cycle 2.4s linear infinite;
}
.scan-readout-item:nth-child(1) {
  animation-delay: 0s;
}
.scan-readout-item:nth-child(2) {
  animation-delay: 0.6s;
}
.scan-readout-item:nth-child(3) {
  animation-delay: 1.2s;
}
.scan-readout-item:nth-child(4) {
  animation-delay: 1.8s;
}

@keyframes scan-readout-cycle {
  0%,
  23% {
    opacity: 1;
  }
  25%,
  100% {
    opacity: 0;
  }
}

/* ── Progress track ─────────────────────────────────────── */
.scan-progress {
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 14px;
  height: 3px;
  background: rgba(3, 26, 96, 0.5);
  border-radius: 9999px;
  overflow: hidden;
}
.scan-progress-fill {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 32%;
  background: linear-gradient(
    90deg,
    rgba(74, 222, 128, 0),
    #4ade80 50%,
    rgba(74, 222, 128, 0)
  );
  box-shadow: 0 0 10px rgba(74, 222, 128, 0.85);
  animation: scan-progress 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  will-change: transform;
}
@keyframes scan-progress {
  0% {
    transform: translateX(-110%);
  }
  100% {
    transform: translateX(360%);
  }
}

/* ── Enter/leave ─────────────────────────────────────────── */
.scan-enter-from,
.scan-leave-to {
  opacity: 0;
}
.scan-enter-active,
.scan-leave-active {
  transition: opacity 0.2s ease;
}

/* ── Reduced motion: hold the frame, drop the motion. ────── */
@media (prefers-reduced-motion: reduce) {
  .scan-grid,
  .scan-sweep,
  .scan-bracket,
  .scan-hud-dot,
  .scan-readout-item,
  .scan-progress-fill {
    animation: none;
  }
  .scan-sweep--primary {
    transform: translateY(-15%);
  }
  .scan-sweep--secondary {
    transform: translateY(-30%);
  }
  .scan-readout-item:nth-child(4) {
    opacity: 1;
  }
  .scan-progress-fill {
    width: 100%;
  }
}
</style>
