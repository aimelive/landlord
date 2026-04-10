<script setup lang="ts">
</script>

<template>
  <section
    class="relative py-16 overflow-visible"
    style="background: #f7f8fc"
  >
    <div
      class="relative max-w-5xl mx-auto px-4"
      v-motion
      :initial="{ opacity: 0, y: 48 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 700, delay: 150 } }"
    >
      <!-- Label -->
      <div class="text-center mb-8">
        <span
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style="background: rgba(41, 159, 77, 0.08); color: #299f4d"
        >
          <span
            class="w-1.5 h-1.5 rounded-full pulse-dot"
            style="background: #299f4d"
          ></span>
          Tenant view
        </span>
        <p class="mt-2 text-sm" style="color: #a8adc1">
          What a tenant sees when they log in
        </p>
      </div>

      <!-- Tenant dashboard shell — flipped perspective -->
      <div
        class="perspective-mockup-flip rounded-2xl overflow-hidden shadow-2xl border"
        style="
          border-color: rgba(41, 159, 77, 0.15);
          box-shadow:
            0 32px 80px rgba(3, 26, 96, 0.14),
            0 8px 24px rgba(41, 159, 77, 0.08);
        "
      >
        <!-- Top bar -->
        <div
          class="flex items-center gap-3 px-4 py-3 border-b"
          style="background: #f0f2f7; border-color: rgba(3, 26, 96, 0.08)"
        >
          <div class="flex gap-1.5">
            <span
              class="w-3 h-3 rounded-full"
              style="background: #f87171"
            ></span>
            <span
              class="w-3 h-3 rounded-full"
              style="background: #fbbf24"
            ></span>
            <span
              class="w-3 h-3 rounded-full"
              style="background: #34d399"
            ></span>
          </div>
          <div class="flex-1 flex justify-center">
            <div
              class="flex items-center gap-2 px-3 py-1 rounded-lg text-xs"
              style="
                background: white;
                color: #a8adc1;
                border: 1px solid #e8eaf0;
                min-width: 180px;
                justify-content: center;
              "
            >
              <span style="color: #dce1e9">🔒</span>
              app.landlord.rw/my-account
            </div>
          </div>
        </div>

        <!-- Dashboard body -->
        <div class="flex" style="background: #f7f8fc; min-height: 400px">
          <!-- Sidebar -->
          <div
            class="hidden sm:flex flex-col w-52 shrink-0 px-3 py-4 gap-1 border-r"
            style="background: white; border-color: rgba(3, 26, 96, 0.07)"
          >
            <div class="flex items-center gap-2 px-2 py-2 mb-3">
              <img src="/logo.png" alt="LandLord" class="h-5 w-auto" />
            </div>
            <div
              v-for="(item, i) in [
                { label: 'My Overview', icon: '▦', active: true },
                { label: 'My Payments', icon: '₣', active: false },
                { label: 'Coverage Map', icon: '📅', active: false },
                { label: 'Credit Score', icon: '📊', active: false },
                { label: 'Reminders', icon: '🔔', active: false },
                { label: 'My Landlord', icon: '🏠', active: false },
              ]"
              :key="i"
              class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-default"
              :style="
                item.active
                  ? 'background:rgba(41,159,77,0.1); color:#299f4d; font-weight:600'
                  : 'color:#a8adc1'
              "
            >
              <span class="text-sm leading-none">{{ item.icon }}</span>
              {{ item.label }}
            </div>
          </div>

          <!-- Main content -->
          <div class="flex-1 p-4 sm:p-5 overflow-hidden">
            <!-- Greeting + score banner -->
            <div class="flex flex-col sm:flex-row gap-3 mb-4">
              <!-- Welcome card -->
              <div
                class="flex-1 rounded-xl px-4 py-3.5 border"
                style="
                  background: linear-gradient(
                    135deg,
                    rgba(41, 159, 77, 0.08),
                    rgba(3, 26, 96, 0.04)
                  );
                  border-color: rgba(41, 159, 77, 0.15);
                "
              >
                <div class="text-xs mb-0.5" style="color: #a8adc1">
                  Welcome back
                </div>
                <div class="text-base font-bold" style="color: #031a60">
                  Jean Mugisha
                </div>
                <div class="text-xs mt-1" style="color: #299f4d">
                  ✓ Covered through January 2026
                </div>
              </div>

              <!-- Credit score card -->
              <div
                class="flex items-center gap-4 rounded-xl px-4 py-3.5 border sm:w-52 shrink-0"
                style="background: white; border-color: rgba(3, 26, 96, 0.08)"
              >
                <div class="relative shrink-0">
                  <svg width="52" height="52" viewBox="0 0 52 52">
                    <circle
                      cx="26"
                      cy="26"
                      r="20"
                      fill="none"
                      stroke="#e8eaf0"
                      stroke-width="4.5"
                    />
                    <circle
                      cx="26"
                      cy="26"
                      r="20"
                      fill="none"
                      stroke="#299f4d"
                      stroke-width="4.5"
                      stroke-linecap="round"
                      stroke-dasharray="125.7"
                      stroke-dashoffset="20"
                      transform="rotate(-90 26 26)"
                    />
                  </svg>
                  <div
                    class="absolute inset-0 flex items-center justify-center"
                  >
                    <span class="text-xs font-bold" style="color: #031a60"
                      >88</span
                    >
                  </div>
                </div>
                <div>
                  <div class="text-xs font-semibold" style="color: #031a60">
                    Credit Score
                  </div>
                  <div class="text-xs font-bold" style="color: #299f4d">
                    Excellent
                  </div>
                  <div class="text-xs" style="color: #a8adc1">
                    ↑ +4 this month
                  </div>
                </div>
              </div>
            </div>

            <!-- Coverage timeline -->
            <div
              class="rounded-xl border p-4 mb-3"
              style="background: white; border-color: rgba(3, 26, 96, 0.08)"
            >
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-semibold" style="color: #031a60"
                  >My Payment Coverage</span
                >
                <span class="text-xs" style="color: #a8adc1"
                  >Kigali Heights #4</span
                >
              </div>
              <div class="flex gap-1.5 mb-2">
                <div
                  v-for="(mo, i) in [
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                    'Jan',
                    'Feb',
                    'Mar',
                  ]"
                  :key="mo"
                  class="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    class="w-full rounded-lg flex items-center justify-center"
                    :style="`height:32px; ${
                      i < 6
                        ? 'background:rgba(41,159,77,0.15)'
                        : i === 6
                          ? 'background:rgba(245,158,11,0.12); border:1px dashed #f59e0b'
                          : 'background:rgba(3,26,96,0.04)'
                    }`"
                  >
                    <svg
                      v-if="i < 6"
                      width="9"
                      height="9"
                      viewBox="0 0 10 10"
                      fill="none"
                    >
                      <path
                        d="M2 5l2 2.5L8 3"
                        stroke="#299f4d"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span
                      v-else-if="i === 6"
                      class="text-xs font-bold"
                      style="color: #f59e0b; font-size: 9px"
                      >Due</span
                    >
                  </div>
                  <span style="color: #a8adc1; font-size: 9px">{{ mo }}</span>
                </div>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span style="color: #a8adc1">6 months paid on time</span>
                <span
                  class="font-semibold px-2 py-0.5 rounded-full"
                  style="background: rgba(245, 158, 11, 0.1); color: #f59e0b"
                  >Feb due in 5 days</span
                >
              </div>
            </div>

            <!-- Recent payments mini table -->
            <div
              class="rounded-xl border overflow-hidden"
              style="background: white; border-color: rgba(3, 26, 96, 0.08)"
            >
              <div
                class="px-4 py-2.5 border-b flex items-center justify-between"
                style="border-color: rgba(3, 26, 96, 0.06)"
              >
                <span class="text-xs font-semibold" style="color: #031a60"
                  >My Recent Payments</span
                >
              </div>
              <div>
                <div
                  v-for="row in [
                    {
                      period: 'January 2026',
                      amt: '200,000',
                      date: '01 Jan 2026',
                      status: 'Paid',
                    },
                    {
                      period: 'December 2025',
                      amt: '200,000',
                      date: '02 Dec 2025',
                      status: 'Paid',
                    },
                    {
                      period: 'November 2025',
                      amt: '200,000',
                      date: '01 Nov 2025',
                      status: 'Paid',
                    },
                  ]"
                  :key="row.period"
                  class="flex items-center gap-3 px-4 py-2.5 border-b last:border-0"
                  style="border-color: rgba(3, 26, 96, 0.05)"
                >
                  <span
                    class="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style="background: rgba(41, 159, 77, 0.1)"
                  >
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M2 5l2 2.5L8 3"
                        stroke="#299f4d"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span>
                  <div class="flex-1">
                    <div class="text-xs font-semibold" style="color: #1a2847">
                      {{ row.period }}
                    </div>
                    <div class="text-xs" style="color: #a8adc1">
                      Paid on {{ row.date }}
                    </div>
                  </div>
                  <div class="text-xs font-semibold" style="color: #031a60">
                    {{ row.amt }}
                    <span style="color: #a8adc1; font-weight: 400">Rwf</span>
                  </div>
                  <span
                    class="text-xs px-2 py-0.5 rounded-full font-medium"
                    style="background: rgba(41, 159, 77, 0.1); color: #299f4d"
                    >{{ row.status }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
