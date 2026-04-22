<script setup lang="ts"></script>

<template>
  <div class="space-y-6" aria-busy="true" aria-label="Loading verification status">
    <section
      class="rounded-2xl border p-6 sm:p-8"
      style="border-color: #e8eaf0; background: white"
    >
      <div class="flex flex-col sm:flex-row sm:items-center gap-5">
        <div class="w-16 h-16 rounded-2xl shrink-0 shimmer" />
        <div class="flex-1 space-y-2 min-w-0">
          <div class="h-5 w-2/3 rounded-md shimmer" />
          <div class="h-3 w-11/12 rounded-md shimmer" />
          <div class="h-3 w-1/2 rounded-md shimmer" />
        </div>
      </div>
    </section>

    <section
      class="rounded-2xl bg-white border overflow-hidden"
      style="border-color: #e8eaf0"
      aria-hidden="true"
    >
      <header
        class="px-6 py-4 border-b flex items-center justify-between gap-3"
        style="border-color: #f0f2f7"
      >
        <div class="space-y-2 flex-1">
          <div class="h-3.5 w-32 rounded-md shimmer" />
          <div class="h-3 w-48 rounded-md shimmer" />
        </div>
        <div class="h-6 w-24 rounded-full shimmer" />
      </header>
      <div class="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        <div class="rounded-xl p-3" style="background: #fafbff">
          <div class="w-full aspect-[1.6/1] rounded-lg shimmer" />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div
            v-for="i in 6"
            :key="i"
            class="rounded-xl p-3.5 space-y-2"
            :class="i <= 2 ? 'sm:col-span-2' : ''"
            style="background: #fafbff"
          >
            <div class="h-3 w-20 rounded-md shimmer" />
            <div class="h-4 w-40 rounded-md shimmer" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.shimmer {
  background: linear-gradient(
    110deg,
    #eceff6 8%,
    #f5f7fb 18%,
    #eceff6 33%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s linear infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
