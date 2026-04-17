import { http } from '../lib/http'

export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  phone_number: string
  is_tenant: boolean
  is_landlord: boolean
  is_email_verified: boolean
  is_phone_verified: boolean
  created_at: string
}

export interface RegisterPayload {
  first_name: string
  last_name: string
  email: string
  phone_number: string
  password: string
  confirm_password: string
  is_tenant: boolean
  is_landlord: boolean
}

export type VerificationType = 'email' | 'phone_number'

export interface RequestOtpPayload {
  verification_type: VerificationType
  email?: string
  phone_number?: string
}

export interface ConfirmOtpPayload extends RequestOtpPayload {
  otp: string
}

export interface LoginPayload {
  login_type: VerificationType
  email?: string
  phone_number?: string
  password: string
}

export interface LoginResponse {
  access: string
  refresh: string
  user: User
}

export const authService = {
  register(payload: RegisterPayload) {
    return http.post<User>('/users/register/', payload).then((r) => r.data)
  },

  requestOtp(payload: RequestOtpPayload) {
    return http
      .post<{ detail: string }>('/users/verify/request/', payload)
      .then((r) => r.data)
  },

  confirmOtp(payload: ConfirmOtpPayload) {
    return http
      .post<{ detail: string }>('/users/verify/confirm/', payload)
      .then((r) => r.data)
  },

  login(payload: LoginPayload) {
    return http.post<LoginResponse>('/users/login/', payload).then((r) => r.data)
  },
}
