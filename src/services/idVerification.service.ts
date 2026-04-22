import { http } from '../lib/http'

export type IDDocumentType = 'national_id' | 'passport'
export type Sex = 'M' | 'F'

export interface IDVerification {
  id: string
  type: IDDocumentType
  type_display: string
  id_number: string
  first_name: string
  last_name: string
  full_name: string
  date_of_birth: string
  sex: Sex
  sex_display: string
  place_of_issue: string
  document_image_url: string
  is_verified: boolean
  verified_at: string | null
  created_at: string
  updated_at: string
}

interface ApiSuccess<T> {
  success: true
  data: T
}

export const idVerificationService = {
  /**
   * Returns the current user's verification record.
   * Rejects with ApiError (status 404, raw.error.code === 'NO_VERIFICATION_RECORD')
   * when the user hasn't submitted one yet — callers must distinguish that from
   * real failures.
   */
  getMine() {
    return http
      .get<ApiSuccess<IDVerification>>('/id-verification/me/')
      .then((r) => r.data.data)
  },

  /**
   * Upload a front-side photo of a Rwandan National ID. The server extracts
   * and persists an unverified record that an admin must later approve.
   */
  submitRwandanId(file: File) {
    const form = new FormData()
    form.append('id_image', file)
    return http
      .post<ApiSuccess<IDVerification>>('/id-verification/extract/', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60_000,
      })
      .then((r) => r.data.data)
  },

  /**
   * Delete the current user's *unverified* record so they can resubmit.
   * Backend rejects with 409 ALREADY_VERIFIED once an admin has approved it.
   */
  deleteMine() {
    return http.delete<void>('/id-verification/me/').then(() => undefined)
  },
}

/**
 * Pull the backend error code out of an ApiError's raw payload, when the
 * shape is `{ success:false, error:{ code, message, details? } }`.
 */
export function extractErrorCode(raw: unknown): string | null {
  if (!raw || typeof raw !== 'object') return null
  const err = (raw as { error?: { code?: unknown } }).error
  if (!err || typeof err !== 'object') return null
  return typeof err.code === 'string' ? err.code : null
}
