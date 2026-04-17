<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { useSeo } from "../composables/useSeo";
import { useAuthStore } from "../stores/auth.store";
import { useApiForm } from "../composables/useApiForm";
import { registerSchema } from "../schemas/auth";
import FieldMsg from "../components/FieldMsg.vue";
import FormAlert from "../components/FormAlert.vue";
import Checkbox from "../components/Checkbox.vue";
import PhoneInput from "../components/PhoneInput.vue";
import EmailField from "../components/EmailField.vue";
import AuthShell from "../components/AuthShell.vue";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  ArrowRight,
  Building2,
  UserCheck,
  CheckCircle2,
} from "lucide-vue-next";

useSeo({
  title: "Create Account",
  description:
    "Create your free LandLord account and start tracking rent payments, coverage months, and your rental credit score.",
  canonical: "https://landlord.aimelive.com/signup",
});

const router = useRouter();
const auth = useAuthStore();

// ── Role (single select, mapped to booleans for API) ──────
type Role = "landlord" | "tenant";
const role = ref<Role>("landlord");

// ── Form (VeeValidate + Zod) ──────────────────────────────
const {
  values,
  errors,
  defineField,
  handleSubmit: handleValidSubmit,
  setFieldValue,
  setFieldError,
  submitCount,
} = useForm({
  validationSchema: toTypedSchema(registerSchema),
  initialValues: {
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
    is_tenant: false,
    is_landlord: true,
    agreed: false as unknown as true,
    role_confirmed: false as unknown as true,
  },
  validateOnMount: false,
});

const [firstName, firstNameProps] = defineField("first_name");
const [lastName, lastNameProps] = defineField("last_name");
const [email, emailProps] = defineField("email");
const [password, passwordProps] = defineField("password");
const [confirmPassword, confirmPasswordProps] = defineField("confirm_password");
const [agreed, agreedProps] = defineField("agreed");
const [roleConfirmed, roleConfirmedProps] = defineField("role_confirmed");

const { submitting, formError, submit } = useApiForm({
  values: values as unknown as Record<string, unknown>,
  setFieldError: (f, m) => setFieldError(f as keyof typeof values, m),
});

function setRole(r: Role) {
  if (role.value !== r) {
    // Switching roles invalidates the prior confirmation.
    setFieldValue("role_confirmed", false as unknown as true);
  }
  role.value = r;
  setFieldValue("is_landlord", r === "landlord");
  setFieldValue("is_tenant", r === "tenant");
}

const [phoneNumber] = defineField("phone_number");

// ── Password strength (UX only) ───────────────────────────
function strengthLevel(pw: string) {
  if (!pw) return { level: 0, label: "", color: "#dce1e9" };
  if (pw.length < 6) return { level: 1, label: "Weak", color: "#ef4444" };
  if (pw.length < 10) return { level: 2, label: "Fair", color: "#f59e0b" };
  return { level: 3, label: "Strong", color: "#299f4d" };
}

const showPass = ref(false);
const showConf = ref(false);

// ── Input visual state ────────────────────────────────────
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
  const result = await submit(() =>
    auth.register({
      first_name: v.first_name,
      last_name: v.last_name,
      email: v.email,
      phone_number: v.phone_number,
      password: v.password,
      confirm_password: v.confirm_password,
      is_tenant: v.is_tenant,
      is_landlord: v.is_landlord,
    }),
  );
  if (result) {
    router.push({
      path: "/verify",
      query: { email: result.email, phone_number: result.phone_number },
    });
  }
});

// ── Left panel copy ───────────────────────────────────────
const panel = computed(() =>
  role.value === "landlord"
    ? {
        heading: "Manage every\nproperty with",
        accent: "full clarity.",
        sub: "Track every payment, send automated reminders, and know exactly which months each tenant has covered.",
        bullets: [
          "Dashboard for all your properties & tenants",
          "Automated rent reminders - stop chasing",
          "Verify tenant credit score before signing",
        ],
        btnBg: "#031a60",
        btnLabel: "Join as Landlord",
      }
    : {
        heading: "Build your\nrental history.",
        accent: "Own your score.",
        sub: "Every on-time payment builds a credit score that follows you everywhere. Be the tenant every landlord wants.",
        bullets: [
          "Know exactly which months you've paid for",
          "Build a portable credit score over time",
          "Communicate with your landlord transparently",
        ],
        btnBg: "#299f4d",
        btnLabel: "Join as Tenant",
      },
);
</script>

<template>
  <AuthShell>
    <template #branding>
      <Transition name="panel" mode="out-in">
        <div :key="role" class="hidden lg:block relative z-10">
          <p
            class="text-xs font-semibold uppercase tracking-widest mb-3"
            style="color: rgba(255, 255, 255, 0.45)"
          >
            {{ role === "landlord" ? "Landlord Portal" : "Tenant Portal" }}
          </p>
          <h2
            class="text-4xl xl:text-5xl font-bold text-white leading-tight mb-2 whitespace-pre-line"
          >
            {{ panel.heading }}
          </h2>
          <p
            class="text-lg font-semibold mb-5 whitespace-pre-line"
            style="color: #4fd87c"
          >
            {{ panel.accent }}
          </p>
          <p
            class="text-sm leading-relaxed mb-6"
            style="color: #a8adc1; max-width: 210px"
          >
            {{ panel.sub }}
          </p>
          <div class="flex flex-col gap-3">
            <div
              v-for="item in panel.bullets"
              :key="item"
              class="flex items-center gap-3 text-sm"
              style="color: #dce1e9"
            >
              <span
                class="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style="background: rgba(41, 159, 77, 0.25)"
              >
                <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M2 5l2.5 2.5L8 3"
                    stroke="#4fd87c"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              {{ item }}
            </div>
          </div>
        </div>
      </Transition>
    </template>

    <h1 class="text-2xl font-bold mb-1" style="color: #031a60">
      Create your account
    </h1>
    <p class="text-sm mb-5" style="color: #a8adc1">
      Already have one?
      <router-link
        to="/login"
        class="font-semibold hover:underline"
        style="color: #299f4d"
        >Log in</router-link
      >
    </p>

    <!-- Role picker: two contextual cards -->
    <fieldset class="mb-5">
      <legend class="text-xs font-semibold mb-2" style="color: #1a2847">
        How will you use LandLord?
      </legend>
      <div class="grid grid-cols-2 gap-2.5">
        <button
          v-for="r in ['landlord', 'tenant'] as const"
          :key="r"
          type="button"
          @click="setRole(r)"
          :aria-pressed="role === r"
          class="relative flex flex-col items-start gap-1.5 p-3 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer"
          :style="
            role === r
              ? 'border-color:#031a60;background:rgba(3,26,96,0.04)'
              : 'border-color:#e2e5ed;background:white'
          "
        >
          <span
            class="w-8 h-8 rounded-full flex items-center justify-center transition-all"
            :style="
              role === r
                ? 'background:#031a60;color:white'
                : 'background:#f0f2f7;color:#031a60'
            "
          >
            <component
              :is="r === 'landlord' ? Building2 : UserCheck"
              :size="16"
            />
          </span>
          <span class="text-sm font-semibold" style="color: #031a60">
            {{ r === "landlord" ? "I'm a landlord" : "I'm a tenant" }}
          </span>
          <span class="text-xs leading-snug" style="color: #a8adc1">
            {{
              r === "landlord"
                ? "Manage properties & tenants"
                : "Track rent & build credit"
            }}
          </span>
          <CheckCircle2
            v-if="role === r"
            :size="14"
            class="absolute top-2 right-2"
            style="color: #299f4d"
          />
        </button>
      </div>
    </fieldset>

    <!-- Form-level error -->
    <FormAlert :show="!!formError">{{ formError }}</FormAlert>

    <form @submit.prevent="handleSubmit" class="space-y-3.5" novalidate>
      <!-- First + Last name (side-by-side) -->
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label
            class="block text-xs font-semibold mb-1.5"
            style="color: #1a2847"
            >First name</label
          >
          <div class="relative">
            <User
              :size="15"
              class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style="color: #a8adc1"
            />
            <input
              v-model="firstName"
              v-bind="firstNameProps"
              type="text"
              autocomplete="given-name"
              placeholder="Jane"
              class="w-full pl-9 pr-3 py-3 text-sm rounded-xl border-0 outline-none transition-all focus:ring-2"
              :style="inputStyle(!!errors.first_name)"
            />
          </div>
          <FieldMsg :show="!!errors.first_name" class="mt-1">{{
            errors.first_name
          }}</FieldMsg>
        </div>
        <div>
          <label
            class="block text-xs font-semibold mb-1.5"
            style="color: #1a2847"
            >Last name</label
          >
          <div class="relative">
            <User
              :size="15"
              class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style="color: #a8adc1"
            />
            <input
              v-model="lastName"
              v-bind="lastNameProps"
              type="text"
              autocomplete="family-name"
              placeholder="Doe"
              class="w-full pl-9 pr-3 py-3 text-sm rounded-xl border-0 outline-none transition-all focus:ring-2"
              :style="inputStyle(!!errors.last_name)"
            />
          </div>
          <FieldMsg :show="!!errors.last_name" class="mt-1">{{
            errors.last_name
          }}</FieldMsg>
        </div>
      </div>

      <!-- Email -->
      <EmailField
        v-model="email"
        :field-props="emailProps"
        :error="errors.email"
      />

      <!-- Phone number -->
      <PhoneInput
        v-model="phoneNumber"
        :schema-error="errors.phone_number"
        :submit-count="submitCount"
      />

      <!-- Password -->
      <div>
        <label class="block text-xs font-semibold mb-1.5" style="color: #1a2847"
          >Password</label
        >
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
            autocomplete="new-password"
            placeholder="Min. 8 characters"
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
        <div v-if="password" class="mt-1.5 flex items-center gap-2">
          <div class="flex gap-1 flex-1">
            <div
              v-for="n in 3"
              :key="n"
              class="h-1 flex-1 rounded-full transition-all duration-300"
              :style="
                n <= strengthLevel(password).level
                  ? `background:${strengthLevel(password).color}`
                  : 'background:#dce1e9'
              "
            ></div>
          </div>
          <span
            class="text-xs font-medium"
            :style="`color:${strengthLevel(password).color}`"
          >
            {{ strengthLevel(password).label }}
          </span>
        </div>
        <FieldMsg :show="!!errors.password" class="mt-1">{{
          errors.password
        }}</FieldMsg>
      </div>

      <!-- Confirm password -->
      <div>
        <label class="block text-xs font-semibold mb-1.5" style="color: #1a2847"
          >Confirm password</label
        >
        <div class="relative">
          <Lock
            :size="15"
            class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style="color: #a8adc1"
          />
          <input
            v-model="confirmPassword"
            v-bind="confirmPasswordProps"
            :type="showConf ? 'text' : 'password'"
            autocomplete="new-password"
            placeholder="Repeat your password"
            class="w-full pl-9 pr-10 py-3 text-sm rounded-xl border-0 outline-none transition-all focus:ring-2"
            :style="
              inputStyle(
                !!errors.confirm_password ||
                  (!!confirmPassword && confirmPassword !== password),
              )
            "
          />
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            @click="showConf = !showConf"
            :aria-label="showConf ? 'Hide' : 'Show'"
          >
            <component
              :is="showConf ? EyeOff : Eye"
              :size="15"
              style="color: #a8adc1"
            />
          </button>
        </div>
        <FieldMsg :show="!!errors.confirm_password" class="mt-1">{{
          errors.confirm_password
        }}</FieldMsg>
      </div>

      <!-- Confirmations -->
      <div class="space-y-2.5 pt-1">
        <div>
          <label class="flex items-start gap-2.5 cursor-pointer select-none">
            <Checkbox
              v-model="roleConfirmed"
              :field-props="roleConfirmedProps"
              :error="!!errors.role_confirmed"
              tone="navy"
              class="mt-0.5"
            />
            <span class="text-xs leading-relaxed" style="color: #a8adc1">
              I confirm I'm signing up as a
              <span class="font-semibold" style="color: #031a60">
                {{ role === "landlord" ? "landlord" : "tenant" }}</span
              >.
              <button
                type="button"
                @click.prevent="
                  setRole(role === 'landlord' ? 'tenant' : 'landlord')
                "
                class="font-semibold hover:underline cursor-pointer"
                style="color: #299f4d"
              >
                Switch to
                {{ role === "landlord" ? "tenant" : "landlord" }}
              </button>
            </span>
          </label>
          <FieldMsg :show="!!errors.role_confirmed" class="ml-6.5 -mt-0.5">{{
            errors.role_confirmed
          }}</FieldMsg>
        </div>

        <div>
          <label class="flex items-start gap-2.5 cursor-pointer select-none">
            <Checkbox
              v-model="agreed"
              :field-props="agreedProps"
              :error="!!errors.agreed"
              tone="green"
              class="mt-0.5"
            />
            <span class="text-xs leading-relaxed" style="color: #a8adc1">
              I agree to the
              <button
                type="button"
                class="font-semibold hover:underline"
                style="color: #031a60"
              >
                Terms of Service
              </button>
              and
              <button
                type="button"
                class="font-semibold hover:underline"
                style="color: #031a60"
              >
                Privacy Policy</button
              >.
            </span>
          </label>
          <FieldMsg :show="!!errors.agreed" class="ml-6.5 -mt-0.5">{{
            errors.agreed
          }}</FieldMsg>
        </div>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        :disabled="submitting"
        class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
        :style="`background:${panel.btnBg}`"
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
        <span>{{ submitting ? "Creating account…" : panel.btnLabel }}</span>
        <ArrowRight v-if="!submitting" :size="15" />
      </button>
    </form>

    <p class="text-center text-xs mt-5" style="color: #a8adc1">
      <router-link to="/" class="hover:underline" style="color: #a8adc1"
        >← Back to homepage</router-link
      >
    </p>
  </AuthShell>
</template>
