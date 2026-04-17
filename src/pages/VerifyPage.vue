<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import {
  Mail,
  Phone,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
} from "lucide-vue-next";
import FormAlert from "../components/FormAlert.vue";
import { useSeo } from "../composables/useSeo";
import { useApiForm } from "../composables/useApiForm";
import { otpSchema } from "../schemas/auth";
import { authService, type VerificationType } from "../services/auth.service";
import FieldMsg from "../components/FieldMsg.vue";

useSeo({
  title: "Verify Your Account",
  description:
    "Confirm your email or phone number to activate your LandLord account.",
  canonical: "https://landlord.aimelive.com/verify",
});

const route = useRoute();
const router = useRouter();

// Identity sourced from query params so refresh doesn't lose context.
const pendingEmail = computed(
  () => (route.query.email as string | undefined) ?? "",
);
const pendingPhone = computed(
  () => (route.query.phone_number as string | undefined) ?? "",
);

const channel = ref<VerificationType | null>(null);
const otpSent = ref(false);
const verified = ref(false);
const cooldown = ref(0);
let cooldownTimer: number | null = null;

type PendingAction = "send" | "resend" | "verify";
const pendingAction = ref<PendingAction | null>(null);

// ── Refresh / close warning ───────────────────────────────
// Fires for real unloads: reload, close tab, close window, back to external.
// Does NOT fire for SPA router.push(), so programmatic navigation after
// a successful verify won't prompt.
// Browser note: Chrome/Safari only show the dialog if the user has
// interacted with the page (click/keypress). This is a browser-level
// anti-abuse rule we cannot bypass.
function beforeUnloadHandler(e: BeforeUnloadEvent) {
  if (verified.value) return undefined;
  const message =
    "You have not finished verifying your account. Are you sure you want to leave?";
  e.preventDefault();
  e.returnValue = message;
  return message;
}

onMounted(() => window.addEventListener("beforeunload", beforeUnloadHandler));
onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", beforeUnloadHandler);
  if (cooldownTimer) window.clearInterval(cooldownTimer);
});

// ── OTP form ──────────────────────────────────────────────
const {
  values,
  errors,
  defineField,
  handleSubmit: handleValidSubmit,
  setFieldError,
  resetField,
} = useForm({
  validationSchema: toTypedSchema(otpSchema),
  initialValues: { otp: "" },
});

const [otp, otpProps] = defineField("otp");

const { submitting, formError, submit, resetFormError } = useApiForm({
  values: values as unknown as Record<string, unknown>,
  setFieldError: (f, m) => setFieldError(f as keyof typeof values, m),
});

const isBusy = computed(() => submitting.value || verified.value);

const loadingCopy = computed(() => {
  if (verified.value) {
    return {
      title: "Verified",
      sub: "Taking you to sign in…",
      tone: "success" as const,
    };
  }
  if (!submitting.value || !pendingAction.value) return null;
  switch (pendingAction.value) {
    case "send":
      return {
        title: "Sending your code…",
        sub: "We're dispatching it now.",
        tone: "loading" as const,
      };
    case "resend":
      return {
        title: "Sending a new code…",
        sub: "Hang tight.",
        tone: "loading" as const,
      };
    case "verify":
      return {
        title: "Verifying your code…",
        sub: "This should only take a moment.",
        tone: "loading" as const,
      };
  }
  return null;
});

function startCooldown(seconds = 60) {
  cooldown.value = seconds;
  if (cooldownTimer) window.clearInterval(cooldownTimer);
  cooldownTimer = window.setInterval(() => {
    cooldown.value -= 1;
    if (cooldown.value <= 0 && cooldownTimer) {
      window.clearInterval(cooldownTimer);
      cooldownTimer = null;
    }
  }, 1000);
}

function identifierFor(c: VerificationType) {
  return c === "email"
    ? { verification_type: "email" as const, email: pendingEmail.value }
    : {
        verification_type: "phone_number" as const,
        phone_number: pendingPhone.value,
      };
}

async function pickChannel(c: VerificationType) {
  if (submitting.value) return;
  if (c === "email" && !pendingEmail.value) return;
  if (c === "phone_number" && !pendingPhone.value) return;
  channel.value = c;
  resetField("otp");
  resetFormError();
  pendingAction.value = "send";
  const ok = await submit(() => authService.requestOtp(identifierFor(c)));
  pendingAction.value = null;
  if (ok) {
    otpSent.value = true;
    startCooldown(60);
  } else {
    channel.value = null;
  }
}

async function resend() {
  if (!channel.value || cooldown.value > 0 || submitting.value) return;
  resetFormError();
  pendingAction.value = "resend";
  const ok = await submit(() =>
    authService.requestOtp(identifierFor(channel.value!)),
  );
  pendingAction.value = null;
  if (ok) {
    resetField("otp");
    startCooldown(60);
  }
}

function changeMethod() {
  otpSent.value = false;
  channel.value = null;
  resetFormError();
  resetField("otp");
}

const handleSubmit = handleValidSubmit(async (v) => {
  if (!channel.value) return;
  pendingAction.value = "verify";
  const result = await submit(() =>
    authService.confirmOtp({ ...identifierFor(channel.value!), otp: v.otp }),
  );
  pendingAction.value = null;
  if (result) {
    verified.value = true;
    // Let the success state read before navigating.
    await new Promise((r) => setTimeout(r, 900));
    router.push({
      path: "/login",
      query: {
        email: pendingEmail.value || undefined,
        phone_number: pendingPhone.value || undefined,
      },
    });
  }
});

// Normalise OTP input to digits only
watch(otp, (v) => {
  const digits = (v ?? "").replace(/\D/g, "").slice(0, 6);
  if (digits !== v) otp.value = digits;
});

const targetLabel = computed(() => {
  if (!channel.value) return "";
  return channel.value === "email" ? pendingEmail.value : pendingPhone.value;
});
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center px-4 py-10 font-sans"
    style="
      background: linear-gradient(
        135deg,
        #dde1ef 0%,
        #e8eaf4 50%,
        #d5d9ea 100%
      );
    "
  >
    <div
      class="w-full max-w-md rounded-3xl overflow-hidden bg-white"
      style="
        box-shadow:
          0 32px 80px rgba(3, 26, 96, 0.18),
          0 8px 24px rgba(3, 26, 96, 0.08);
      "
      v-motion
      :initial="{ opacity: 0, y: 24 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 450 } }"
    >
      <div class="px-7 pt-8 pb-6" style="background: #031a60">
        <div class="mb-5">
          <span class="logo-capsule">
            <img src="/logo.png" alt="LandLord" class="h-7 w-auto" />
          </span>
        </div>
        <h1 class="text-2xl font-bold text-white leading-tight">
          {{ otpSent ? "Enter your code" : "One last step" }}
        </h1>
        <p class="text-sm mt-1.5" style="color: #a8adc1">
          {{
            otpSent
              ? `We sent a 6-digit code to ${targetLabel}`
              : "Choose how you want to verify your account."
          }}
        </p>
      </div>

      <div class="px-7 py-7 relative">
        <FormAlert :show="!!formError && !isBusy">{{ formError }}</FormAlert>

        <div
          class="transition-all duration-300"
          :class="
            isBusy
              ? 'blur-[2px] pointer-events-none select-none opacity-80'
              : ''
          "
        >
          <!-- ─── Channel picker ─── -->
          <div v-if="!otpSent" class="space-y-2.5">
            <button
              type="button"
              :disabled="submitting || !pendingEmail"
              @click="pickChannel('email')"
              class="w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all hover:border-ll-navy disabled:opacity-50 cursor-pointer"
              style="border-color: #e2e5ed; background: #f0f2f7"
            >
              <span
                class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style="background: white"
              >
                <Mail :size="18" style="color: #031a60" />
              </span>
              <span class="flex-1 text-left">
                <span class="block text-sm font-semibold" style="color: #031a60"
                  >Email</span
                >
                <span class="block text-xs truncate" style="color: #a8adc1">
                  {{ pendingEmail || "—" }}
                </span>
              </span>
              <ArrowRight :size="16" style="color: #a8adc1" />
            </button>

            <button
              type="button"
              :disabled="submitting || !pendingPhone"
              @click="pickChannel('phone_number')"
              class="w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all hover:border-ll-navy disabled:opacity-50 cursor-pointer"
              style="border-color: #e2e5ed; background: #f0f2f7"
            >
              <span
                class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style="background: white"
              >
                <Phone :size="18" style="color: #031a60" />
              </span>
              <span class="flex-1 text-left">
                <span class="block text-sm font-semibold" style="color: #031a60"
                  >Phone / SMS</span
                >
                <span class="block text-xs truncate" style="color: #a8adc1">
                  {{ pendingPhone || "—" }}
                </span>
              </span>
              <ArrowRight :size="16" style="color: #a8adc1" />
            </button>
          </div>

          <!-- ─── OTP form ─── -->
          <form
            v-else
            @submit.prevent="handleSubmit"
            class="space-y-4"
            novalidate
          >
            <div>
              <label
                class="block text-xs font-semibold mb-1.5"
                style="color: #1a2847"
              >
                6-digit code
              </label>
              <input
                v-model="otp"
                v-bind="otpProps"
                type="text"
                inputmode="numeric"
                autocomplete="one-time-code"
                maxlength="6"
                placeholder="000000"
                :disabled="isBusy"
                class="w-full px-4 py-3.5 rounded-xl border-0 outline-none transition-all focus:ring-2 text-center text-xl tracking-[0.5em] font-semibold"
                :style="
                  errors.otp
                    ? 'background:rgba(239,68,68,0.06);color:#031a60;box-shadow:inset 0 0 0 1px rgba(239,68,68,0.45);--tw-ring-color:rgba(239,68,68,0.25)'
                    : 'background:#f0f2f7;color:#031a60;--tw-ring-color:rgba(3,26,96,0.15)'
                "
              />
              <FieldMsg :show="!!errors.otp" class="mt-1">{{
                errors.otp
              }}</FieldMsg>
            </div>

            <button
              type="submit"
              :disabled="isBusy || (otp?.length ?? 0) !== 6"
              class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
              style="background: #031a60"
            >
              <CheckCircle2 :size="15" />
              <span>Verify &amp; continue</span>
            </button>

            <div class="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                @click="changeMethod"
                :disabled="isBusy"
                class="hover:underline font-medium cursor-pointer disabled:opacity-50"
                style="color: #a8adc1"
              >
                ← Change method
              </button>
              <button
                type="button"
                @click="resend"
                :disabled="cooldown > 0 || isBusy"
                class="inline-flex items-center gap-1.5 font-semibold hover:underline disabled:no-underline disabled:opacity-60 cursor-pointer"
                style="color: #299f4d"
              >
                <RefreshCw :size="12" />
                {{ cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code" }}
              </button>
            </div>
          </form>
        </div>

        <!-- ─── Busy overlay (covers picker, form, and success state) ─── -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="loadingCopy"
            class="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center"
            style="
              background: rgba(255, 255, 255, 0.92);
              backdrop-filter: blur(6px);
              z-index: 10;
            "
            aria-live="polite"
            role="status"
          >
            <template v-if="loadingCopy.tone === 'success'">
              <div
                class="relative w-14 h-14 rounded-full flex items-center justify-center"
                style="background: rgba(41, 159, 77, 0.12)"
              >
                <span
                  class="absolute inset-0 rounded-full animate-ping"
                  style="background: rgba(41, 159, 77, 0.18)"
                ></span>
                <CheckCircle2
                  :size="32"
                  style="color: #299f4d"
                  class="relative"
                />
              </div>
            </template>

            <template v-else>
              <div class="relative w-14 h-14 flex items-center justify-center">
                <svg
                  class="animate-spin"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="rgba(3,26,96,0.12)"
                    stroke-width="2.5"
                  />
                  <path
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke="#031a60"
                    stroke-width="2.5"
                    stroke-linecap="round"
                  />
                </svg>
              </div>
            </template>

            <p class="text-sm font-semibold mt-1" style="color: #031a60">
              {{ loadingCopy.title }}
            </p>
            <p class="text-xs" style="color: #a8adc1">{{ loadingCopy.sub }}</p>
          </div>
        </Transition>

        <p class="text-center text-xs mt-6" style="color: #a8adc1">
          <router-link to="/signup" class="hover:underline"
            >← Back to signup</router-link
          >
        </p>
      </div>
    </div>
  </div>
</template>
