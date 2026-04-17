<script setup lang="ts">
// Wrapper for Login / Signup: gradient bg, two-panel card, clip-path, decorations.
// Consumers supply the left-panel body via the `branding` slot and the form
// via the default slot.
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-start pt-6 pb-10 px-4 sm:justify-center sm:py-10 sm:px-6 lg:px-10 font-sans"
    style="
      background: linear-gradient(
        135deg,
        #dde1ef 0%,
        #e8eaf4 50%,
        #d5d9ea 100%
      );
    "
  >
    <svg
      width="0"
      height="0"
      style="position: absolute; overflow: visible"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="auth-shell-clip" clipPathUnits="objectBoundingBox">
          <path d="M 0,0 L 0.72,0 C 1.0,0.1 1.0,0.9 0.72,1 L 0,1 Z" />
        </clipPath>
      </defs>
    </svg>

    <div
      class="w-full max-w-5xl rounded-[2rem] overflow-hidden flex flex-col lg:flex-row"
      style="
        box-shadow:
          0 48px 120px rgba(3, 26, 96, 0.2),
          0 12px 40px rgba(3, 26, 96, 0.12);
        background: white;
      "
    >
      <!-- ── Left - Branding ── -->
      <div
        class="panel-left lg:w-[50%] hidden lg:flex flex-col justify-between px-6 sm:px-10 lg:pl-12 lg:pr-24 py-5 lg:py-12 lg:h-auto relative overflow-hidden"
        style="background: #031a60"
      >
        <svg
          class="lg:hidden absolute bottom-0 left-0 w-full pointer-events-none"
          style="height: 40px"
          preserveAspectRatio="none"
          viewBox="0 0 100 20"
        >
          <path d="M0,0 L100,0 L100,10 Q50,20 0,10 Z" fill="white" />
        </svg>

        <div
          class="hidden lg:block absolute pointer-events-none"
          style="
            top: -60px;
            right: 20px;
            width: 280px;
            height: 280px;
            border-radius: 50%;
            background: radial-gradient(
              circle at 50% 50%,
              rgba(41, 159, 77, 0.35) 0%,
              transparent 70%
            );
            filter: blur(55px);
          "
        ></div>
        <div
          class="hidden lg:block absolute pointer-events-none"
          style="
            bottom: -50px;
            left: -20px;
            width: 240px;
            height: 240px;
            border-radius: 50%;
            background: radial-gradient(
              circle,
              rgba(41, 159, 77, 0.18) 0%,
              transparent 70%
            );
            filter: blur(75px);
          "
        ></div>
        <div
          class="hidden lg:block absolute pointer-events-none"
          style="
            top: 50%;
            right: 0;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: radial-gradient(
              circle,
              rgba(91, 138, 245, 0.2) 0%,
              transparent 70%
            );
            filter: blur(65px);
            transform: translateY(-50%);
          "
        ></div>

        <span class="logo-capsule self-start relative z-10">
          <img src="/logo.png" alt="LandLord" class="h-7 w-auto" />
        </span>

        <slot name="branding" />

        <p class="hidden lg:block text-xs relative z-10" style="color: #6b7294">
          &copy; {{ new Date().getFullYear() }} LandLord · Built for clarity.
        </p>
      </div>

      <!-- ── Right - Form ── -->
      <div
        class="flex-1 flex items-center justify-center px-6 sm:px-10 xl:px-14 py-10 lg:py-12 relative bg-white"
      >
        <div
          class="w-full max-w-sm relative z-10"
          v-motion
          :initial="{ opacity: 0, y: 24 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
        >
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  .panel-left {
    clip-path: url(#auth-shell-clip);
  }
}
</style>
