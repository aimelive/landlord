<script setup lang="ts">
import { Mail, Phone, ExternalLink } from "lucide-vue-next";
</script>

<template>
  <footer
    id="contact"
    class="mt-auto border-t"
    style="border-color: rgba(3, 26, 96, 0.06); background: white"
  >
    <div class="max-w-6xl mx-auto px-4 pt-10 pb-6">
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-10">
        <div class="sm:col-span-1">
          <img src="/logo.png" alt="LandLord" class="h-7 w-auto mb-3" />
          <p class="text-xs leading-relaxed" style="color: #6b7294">
            Rwanda's digital rent management platform. Track payments, send
            reminders, build tenant credit scores, and manage properties - all
            in one place.
          </p>
        </div>

        <div>
          <h4
            class="text-xs font-bold uppercase tracking-wider mb-3"
            style="color: #031a60"
          >
            Product
          </h4>
          <ul class="space-y-2">
            <li>
              <a
                href="#features"
                class="text-xs transition-colors hover:text-ll-green"
                style="color: #6b7294"
                >Features</a
              >
            </li>
            <li>
              <a
                href="#how-it-works"
                class="text-xs transition-colors hover:text-ll-green"
                style="color: #6b7294"
                >How it works</a
              >
            </li>
            <li>
              <a
                href="#credit-score"
                class="text-xs transition-colors hover:text-ll-green"
                style="color: #6b7294"
                >Tenant Credit Score</a
              >
            </li>
            <li>
              <router-link
                to="/signup"
                class="text-xs transition-colors hover:text-ll-green"
                style="color: #6b7294"
                >Sign up free</router-link
              >
            </li>
          </ul>
        </div>

        <div>
          <h4
            class="text-xs font-bold uppercase tracking-wider mb-3"
            style="color: #031a60"
          >
            Legal
          </h4>
          <ul class="space-y-2">
            <li>
              <button
                class="text-xs transition-colors hover:text-ll-green cursor-pointer"
                style="color: #6b7294"
              >
                Privacy Policy
              </button>
            </li>
            <li>
              <button
                class="text-xs transition-colors hover:text-ll-green cursor-pointer"
                style="color: #6b7294"
              >
                Terms of Service
              </button>
            </li>
            <li>
              <button
                class="text-xs transition-colors hover:text-ll-green cursor-pointer"
                style="color: #6b7294"
              >
                Cookie Policy
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4
            class="text-xs font-bold uppercase tracking-wider mb-3"
            style="color: #031a60"
          >
            Contact
          </h4>
          <ul class="space-y-2.5">
            <li>
              <a
                href="mailto:info.netiiv@gmail.com"
                class="flex items-center gap-2 text-xs transition-colors hover:text-ll-green"
                style="color: #6b7294"
              >
                <Mail :size="12" class="shrink-0" style="color: #a8adc1" />
                info.netiiv@gmail.com
              </a>
            </li>
            <li>
              <a
                href="tel:+250786857773"
                class="flex items-center gap-2 text-xs transition-colors hover:text-ll-green"
                style="color: #6b7294"
              >
                <Phone :size="12" class="shrink-0" style="color: #a8adc1" />
                +250 786 85 773
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="h-px mb-5" style="background: rgba(3, 26, 96, 0.06)"></div>

      <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-xs" style="color: #a8adc1">
          &copy; {{ new Date().getFullYear() }} LandLord. All rights reserved.
        </p>

        <a
          href="https://netiiv.com"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-ll-green"
          style="color: #a8adc1"
        >
          Powered by
          <span style="color: #031a60" class="font-semibold"
            >Netiiv Group Ltd</span
          >
          <ExternalLink :size="10" />
        </a>
      </div>
    </div>
  </footer>
</template>
