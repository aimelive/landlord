<script setup lang="ts">
</script>

<template>
  <section
    class="relative pb-16 overflow-visible"
    style="background: #f7f8fc"
  >
    <div
      class="relative max-w-5xl mx-auto px-4"
      v-motion
      :initial="{ opacity: 0, y: 48 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 700, delay: 200 } }"
    >
      <!-- Label -->
      <div class="text-center mb-8">
        <span
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style="background: rgba(3, 26, 96, 0.06); color: #031a60"
        >
          <span
            class="w-1.5 h-1.5 rounded-full pulse-dot"
            style="background: #299f4d"
          ></span>
          Live platform preview
        </span>
      </div>

      <!-- Dashboard shell -->
      <div
        class="perspective-mockup rounded-2xl overflow-hidden shadow-2xl border"
        style="
          border-color: rgba(3, 26, 96, 0.1);
          box-shadow:
            0 32px 80px rgba(3, 26, 96, 0.14),
            0 8px 24px rgba(3, 26, 96, 0.06);
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
              <span style="color: #dce1e9">🔒</span> app.landlord.rw/dashboard
            </div>
          </div>
        </div>

        <!-- Dashboard body -->
        <div class="flex" style="background: #f7f8fc; min-height: 420px">
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
                { label: 'Overview', icon: '▦', active: true },
                { label: 'Payments', icon: '₣', active: false },
                { label: 'Tenants', icon: '👤', active: false },
                { label: 'Properties', icon: '🏠', active: false },
                { label: 'Reminders', icon: '🔔', active: false },
                { label: 'Credit Score', icon: '📊', active: false },
              ]"
              :key="i"
              class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-default"
              :style="
                item.active
                  ? 'background:rgba(3,26,96,0.07); color:#031a60; font-weight:600'
                  : 'color:#a8adc1'
              "
            >
              <span class="text-sm leading-none">{{ item.icon }}</span>
              {{ item.label }}
            </div>
          </div>

          <!-- Main content -->
          <div class="flex-1 p-4 sm:p-5 overflow-hidden">
            <!-- Top row: stat cards -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div
                v-for="card in [
                  {
                    label: 'Total collected',
                    value: '4,850,000',
                    unit: 'Rwf',
                    color: '#299f4d',
                    bg: 'rgba(41,159,77,0.07)',
                  },
                  {
                    label: 'Active tenants',
                    value: '18',
                    unit: '',
                    color: '#031a60',
                    bg: 'rgba(3,26,96,0.05)',
                  },
                  {
                    label: 'Overdue payments',
                    value: '2',
                    unit: '',
                    color: '#f59e0b',
                    bg: 'rgba(245,158,11,0.07)',
                  },
                  {
                    label: 'Avg credit score',
                    value: '84',
                    unit: '/ 100',
                    color: '#5b8af5',
                    bg: 'rgba(91,138,245,0.07)',
                  },
                ]"
                :key="card.label"
                class="rounded-xl px-3 py-3 border"
                :style="`background:${card.bg}; border-color:rgba(3,26,96,0.07)`"
              >
                <div class="text-xs mb-1" style="color: #a8adc1">
                  {{ card.label }}
                </div>
                <div
                  class="font-bold text-base leading-tight"
                  :style="`color:${card.color}`"
                >
                  {{ card.value }}
                  <span class="text-xs font-normal" style="color: #a8adc1">{{
                    card.unit
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Middle: recent payments table + coverage chart -->
            <div class="grid grid-cols-1 lg:grid-cols-5 gap-3">
              <!-- Recent payments -->
              <div
                class="lg:col-span-3 rounded-xl border overflow-hidden"
                style="background: white; border-color: rgba(3, 26, 96, 0.08)"
              >
                <div
                  class="px-4 py-3 border-b flex items-center justify-between"
                  style="border-color: rgba(3, 26, 96, 0.07)"
                >
                  <span class="text-xs font-semibold" style="color: #031a60"
                    >Recent Payments</span
                  >
                  <span class="text-xs" style="color: #a8adc1"
                    >This month</span
                  >
                </div>
                <div
                  class="divide-y"
                  style="divide-color: rgba(3, 26, 96, 0.05)"
                >
                  <div
                    v-for="row in [
                      {
                        name: 'J. Mugisha',
                        prop: 'Kigali Heights #4',
                        amt: '200,000',
                        months: 'Jan–Feb 2026',
                        status: 'Paid',
                        dot: '#299f4d',
                      },
                      {
                        name: 'A. Uwimana',
                        prop: 'Nyamirambo #2',
                        amt: '150,000',
                        months: 'Jan 2026',
                        status: 'Paid',
                        dot: '#299f4d',
                      },
                      {
                        name: 'P. Niyonzima',
                        prop: 'Kimironko #7',
                        amt: '300,000',
                        months: 'Nov–Jan 2026',
                        status: 'Paid',
                        dot: '#299f4d',
                      },
                      {
                        name: 'D. Habimana',
                        prop: 'Nyarutarama Villa',
                        amt: '—',
                        months: 'Feb 2026',
                        status: 'Overdue',
                        dot: '#f87171',
                      },
                    ]"
                    :key="row.name"
                    class="flex items-center gap-3 px-4 py-2.5"
                  >
                    <div
                      class="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white"
                      :style="`background:${row.dot}`"
                    >
                      {{ row.name[0] }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <div
                        class="text-xs font-semibold truncate"
                        style="color: #1a2847"
                      >
                        {{ row.name }}
                      </div>
                      <div class="text-xs truncate" style="color: #a8adc1">
                        {{ row.prop }}
                      </div>
                    </div>
                    <div class="text-right shrink-0">
                      <div
                        class="text-xs font-semibold"
                        style="color: #031a60"
                      >
                        {{ row.amt }} <span style="color: #a8adc1">Rwf</span>
                      </div>
                      <div class="text-xs" style="color: #a8adc1">
                        {{ row.months }}
                      </div>
                    </div>
                    <span
                      class="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
                      :style="
                        row.status === 'Paid'
                          ? 'background:rgba(41,159,77,0.1); color:#299f4d'
                          : 'background:rgba(248,113,113,0.1); color:#f87171'
                      "
                    >
                      {{ row.status }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Coverage + score panel -->
              <div class="lg:col-span-2 flex flex-col gap-3">
                <!-- Coverage bar -->
                <div
                  class="rounded-xl border p-4"
                  style="
                    background: white;
                    border-color: rgba(3, 26, 96, 0.08);
                  "
                >
                  <div
                    class="text-xs font-semibold mb-3"
                    style="color: #031a60"
                  >
                    Coverage — J. Mugisha
                  </div>
                  <div class="flex gap-1 mb-2">
                    <div
                      v-for="(m, i) in [
                        'Sep',
                        'Oct',
                        'Nov',
                        'Dec',
                        'Jan',
                        'Feb',
                      ]"
                      :key="m"
                      class="flex-1 flex flex-col items-center gap-1"
                    >
                      <div
                        class="w-full h-5 rounded"
                        :style="
                          i < 5
                            ? 'background:rgba(41,159,77,0.18)'
                            : 'background:rgba(3,26,96,0.06)'
                        "
                      >
                        <div
                          v-if="i < 5"
                          class="w-full h-full rounded flex items-center justify-center"
                        >
                          <svg
                            width="8"
                            height="8"
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
                        </div>
                      </div>
                      <span
                        class="text-xs"
                        style="color: #a8adc1; font-size: 9px"
                        >{{ m }}</span
                      >
                    </div>
                  </div>
                  <div class="text-xs" style="color: #a8adc1">
                    Covered through
                    <span style="color: #031a60; font-weight: 600"
                      >Jan 2026</span
                    >
                  </div>
                </div>

                <!-- Mini credit score -->
                <div
                  class="rounded-xl border p-4 flex items-center gap-4"
                  style="
                    background: white;
                    border-color: rgba(3, 26, 96, 0.08);
                  "
                >
                  <div class="relative shrink-0">
                    <svg width="56" height="56" viewBox="0 0 56 56">
                      <circle
                        cx="28"
                        cy="28"
                        r="22"
                        fill="none"
                        stroke="#e8eaf0"
                        stroke-width="5"
                      />
                      <circle
                        cx="28"
                        cy="28"
                        r="22"
                        fill="none"
                        stroke="#299f4d"
                        stroke-width="5"
                        stroke-linecap="round"
                        stroke-dasharray="138.2"
                        stroke-dashoffset="28"
                        transform="rotate(-90 28 28)"
                      />
                    </svg>
                    <div
                      class="absolute inset-0 flex items-center justify-center"
                    >
                      <span class="text-sm font-bold" style="color: #031a60"
                        >88</span
                      >
                    </div>
                  </div>
                  <div>
                    <div class="text-xs font-semibold" style="color: #031a60">
                      Credit Score
                    </div>
                    <div
                      class="text-xs"
                      style="color: #299f4d; font-weight: 600"
                    >
                      Excellent
                    </div>
                    <div class="text-xs mt-0.5" style="color: #a8adc1">
                      Top 12% · ↑ +4 this month
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom fade into next section -->
      <div
        class="absolute bottom-0 inset-x-0 h-24 pointer-events-none"
        style="background: linear-gradient(to bottom, transparent, #f7f8fc)"
      ></div>
    </div>
  </section>
</template>
