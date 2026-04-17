import { z } from "zod";

/**
 * Mirrors RegisterSerializer in apps/users/serializers.py.
 * Backend also enforces these; these are for UX latency only.
 */
const nameRule = z
  .string()
  .trim()
  .min(2, "Must be at least 2 characters")
  .max(100, "Too long")
  .regex(/^[\p{L} '-]+$/u, "Letters, spaces, hyphens and apostrophes only");

export const passwordRule = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Z]/, "One uppercase letter required")
  .regex(/[a-z]/, "One lowercase letter required")
  .regex(/[0-9]/, "One digit required")
  .regex(/[@$!%*?&#\-_]/, "One special character (@$!%*?&#-_) required");

export const registerSchema = z
  .object({
    first_name: nameRule,
    last_name: nameRule,
    email: z.string().trim().toLowerCase().email("Enter a valid email"),
    phone_number: z
      .string()
      .trim()
      .regex(
        /^\+[1-9]\d{6,14}$/,
        "Phone number must be in international E.164 format",
      ),
    password: passwordRule,
    confirm_password: z.string(),
    is_tenant: z.boolean(),
    is_landlord: z.boolean(),
    agreed: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms to continue" }),
    }),
    role_confirmed: z.literal(true, {
      errorMap: () => ({
        message: "Please confirm the role you are signing up as",
      }),
    }),
  })
  .refine((v) => v.password === v.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  })
  .refine((v) => v.is_tenant || v.is_landlord, {
    path: ["is_tenant"],
    message: "Pick at least one role",
  });

export type RegisterForm = z.infer<typeof registerSchema>;

export const otpSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter the 6-digit code"),
});

export type OtpForm = z.infer<typeof otpSchema>;

/**
 * Login - a single flat schema so VeeValidate can bind every field, with a
 * superRefine that enforces only the relevant identifier for the chosen
 * login_type. Mirrors LoginSerializer on the backend.
 */
export const loginSchema = z
  .object({
    login_type: z.enum(["email", "phone_number"]),
    email: z.string().trim().toLowerCase().optional().or(z.literal("")),
    phone_number: z.string().trim().optional().or(z.literal("")),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "At least 8 characters"),
  })
  .superRefine((v, ctx) => {
    if (v.login_type === "email") {
      if (!v.email) {
        ctx.addIssue({
          code: "custom",
          path: ["email"],
          message: "Email is required",
        });
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) {
        ctx.addIssue({
          code: "custom",
          path: ["email"],
          message: "Enter a valid email",
        });
      }
    } else {
      if (!v.phone_number) {
        ctx.addIssue({
          code: "custom",
          path: ["phone_number"],
          message: "Phone number is required",
        });
      } else if (!/^\+[1-9]\d{6,14}$/.test(v.phone_number)) {
        ctx.addIssue({
          code: "custom",
          path: ["phone_number"],
          message: "Phone number must be in international E.164 format",
        });
      }
    }
  });

export type LoginForm = z.infer<typeof loginSchema>;
