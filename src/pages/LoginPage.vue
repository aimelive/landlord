<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { useSeo } from "../composables/useSeo";
import { useApiForm } from "../composables/useApiForm";
import { loginSchema } from "../schemas/auth";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../stores/auth.store";
import FieldMsg from "../components/FieldMsg.vue";
import FormAlert from "../components/FormAlert.vue";
import PhoneInput from "../components/PhoneInput.vue";
import EmailField from "../components/EmailField.vue";
import AuthShell from "../components/AuthShell.vue";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Phone } from "lucide-vue-next";

useSeo({
  title: "Sign In",
  description:
    "Sign in to your LandLord account to view your rent payment history and coverage timeline.",
  canonical: "https://landlord.aimelive.com/login",
});

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

// ── Form ──────────────────────────────────────────────────
const {
  values,
  errors,
  defineField,
  handleSubmit: handleValidSubmit,
  setFieldValue,
  setFieldError,
  submitCount,
} = useForm({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: {
    login_type: "email" as "email" | "phone_number",
    email: "",
    phone_number: "",
    password: "",
  },
  validateOnMount: false,
});

const [email, emailProps] = defineField("email");
const [password, passwordProps] = defineField("password");

const { submitting, formError, submit } = useApiForm({
  values: values as unknown as Record<string, unknown>,
  setFieldError: (f, m) => setFieldError(f as keyof typeof values, m),
});

// ── Login method toggle ───────────────────────────────────
type LoginMethod = "email" | "phone_number";
const method = ref<LoginMethod>("email");

function setMethod(m: LoginMethod) {
  method.value = m;
  setFieldValue("login_type", m);
  // Clear irrelevant-side error so switching doesn't carry a stale message.
  setFieldError(m === "email" ? "phone_number" : "email", undefined);
}

const [phoneNumber] = defineField("phone_number");

// ── Prefill from query (email + phone_number) ─────────────
onMounted(() => {
  const qEmail = (route.query.email as string | undefined) ?? "";
  const qPhone = (route.query.phone_number as string | undefined) ?? "";

  if (qEmail) setFieldValue("email", qEmail);
  if (qPhone) setFieldValue("phone_number", qPhone);

  // Default method: email if provided, otherwise phone if provided.
  if (qEmail) setMethod("email");
  else if (qPhone) setMethod("phone_number");
});

// ── Password visibility ───────────────────────────────────
const showPass = ref(false);

// ── Field visual state ────────────────────────────────────
const NORMAL_STYLE =
  "background:#f0f2f7;color:#031a60;--tw-ring-color:rgba(3,26,96,0.15)";
const ERROR_STYLE =
  "background:rgba(239,68,68,0.06);color:#031a60;" +
  "box-shadow:inset 0 0 0 1px rgba(239,68,68,0.45);" +
  "--tw-ring-color:rgba(239,68,68,0.25)";
function inputStyle(hasError: boolean) {
  return hasError ? ERROR_STYLE : NORMAL_STYLE;
}

// ── Submit ────────────────────────────────────────────────
const handleSubmit = handleValidSubmit(async (v) => {
  const payload =
    v.login_type === "email"
      ? { login_type: "email" as const, email: v.email, password: v.password }
      : {
          login_type: "phone_number" as const,
          phone_number: v.phone_number,
          password: v.password,
        };

  const session = await submit(() => authService.login(payload));
  if (!session) return;

  const ok = auth.persistSession(session);
  if (!ok) {
    // Backend returned a user with neither is_tenant nor is_landlord — surface
    // on whichever identifier field is currently visible.
    const field = v.login_type === "email" ? "email" : "phone_number";
    setFieldError(field, "This account is not active. Please contact support.");
    return;
  }

  const next = (route.query.next as string | undefined) || "/dashboard";
  router.push(next);
});
</script>

<template>
  <AuthShell>
    <template #branding>
      <div class="hidden lg:block relative z-10">
        <p
          class="text-xs font-semibold uppercase tracking-widest mb-3"
          style="color: rgba(255, 255, 255, 0.45)"
        >
          Welcome back
        </p>
        <h2
          class="text-4xl xl:text-5xl font-bold text-white leading-tight mb-3"
        >
          Sign in to<br />your account.
        </h2>
        <p class="text-lg font-semibold mb-4" style="color: #4fd87c">
          Pick up where you left off.
        </p>
        <p
          class="text-sm leading-relaxed"
          style="color: #a8adc1; max-width: 240px"
        >
          Manage rent, track payments, and keep your rental history up to date -
          all in one place.
        </p>
      </div>
    </template>

    <h1 class="text-2xl font-bold mb-1" style="color: #031a60">Sign in</h1>
    <p class="text-sm mb-5" style="color: #a8adc1">
      Don't have an account?
      <router-link
        to="/signup"
        class="font-semibold hover:underline"
        style="color: #299f4d"
      >
        Create one free
      </router-link>
    </p>

    <!-- Method picker -->
    <div class="mb-5">
      <p class="text-xs font-semibold mb-2" style="color: #1a2847">
        How would you like to sign in?
      </p>
      <div
        class="grid grid-cols-2 gap-2 p-1 rounded-xl"
        style="background: #f0f2f7"
        role="tablist"
        aria-label="Sign-in method"
      >
        <button
          v-for="m in ['email', 'phone_number'] as const"
          :key="m"
          type="button"
          role="tab"
          :aria-selected="method === m"
          @click="setMethod(m)"
          class="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer"
          :style="
            method === m
              ? 'background:white;color:#031a60;box-shadow:0 1px 8px rgba(3,26,96,0.1)'
              : 'color:#a8adc1;background:transparent'
          "
        >
          <component :is="m === 'email' ? Mail : Phone" :size="14" />
          {{ m === "email" ? "Email" : "Phone number" }}
        </button>
      </div>
    </div>

    <!-- Form-level error -->
    <FormAlert :show="!!formError">{{ formError }}</FormAlert>

    <form @submit.prevent="handleSubmit" class="space-y-4" novalidate>
      <!-- Email (shown when method === 'email') -->
      <EmailField
        v-if="method === 'email'"
        v-model="email"
        :field-props="emailProps"
        :error="errors.email"
      />

      <!-- Phone (shown when method === 'phone_number') -->
      <PhoneInput
        v-else
        v-model="phoneNumber"
        :schema-error="errors.phone_number"
        :submit-count="submitCount"
      />

      <!-- Password -->
      <div>
        <div class="flex items-center justify-between mb-1.5">
          <label class="text-xs font-semibold" style="color: #1a2847"
            >Password</label
          >
          <button
            type="button"
            class="text-xs hover:underline cursor-pointer"
            style="color: #299f4d"
          >
            Forgot password?
          </button>
        </div>
        <div class="relative">
          <Lock
            :size="15"
            class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style="color: #a8adc1"
          />
          <input
            v-model="password"
            v-bind="passwordProps"
            :type="showPass ? 'text' : 'password'"
            autocomplete="current-password"
            placeholder="••••••••"
            class="w-full pl-9 pr-10 py-3 text-sm rounded-xl border-0 outline-none transition-all focus:ring-2"
            :style="inputStyle(!!errors.password)"
          />
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            @click="showPass = !showPass"
            :aria-label="showPass ? 'Hide' : 'Show'"
          >
            <component
              :is="showPass ? EyeOff : Eye"
              :size="15"
              style="color: #a8adc1"
            />
          </button>
        </div>
        <FieldMsg :show="!!errors.password" class="mt-1">{{
          errors.password
        }}</FieldMsg>
      </div>

      <button
        type="submit"
        :disabled="submitting"
        class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
        style="background: #031a60"
      >
        <svg
          v-if="submitting"
          class="animate-spin shrink-0"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="rgba(255,255,255,0.3)"
            stroke-width="3"
          />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="white"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
        <span>{{ submitting ? "Signing in…" : "Sign in" }}</span>
        <ArrowRight v-if="!submitting" :size="15" />
      </button>
    </form>

    <p class="text-center text-xs mt-6" style="color: #a8adc1">
      <router-link to="/" class="hover:underline" style="color: #a8adc1">
        ← Back to homepage
      </router-link>
    </p>
  </AuthShell>
</template>
