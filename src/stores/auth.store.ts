import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { authService, type RegisterPayload, type User } from '../services/auth.service'
import { STORAGE_KEYS, storage } from '../lib/storage'

export type AuthStatus = 'anonymous' | 'authenticated'
export type ActiveRole = 'landlord' | 'tenant'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(storage.get<User>(STORAGE_KEYS.user))
  const accessToken = ref<string | null>(storage.get<string>(STORAGE_KEYS.accessToken))
  const refreshToken = ref<string | null>(storage.get<string>(STORAGE_KEYS.refreshToken))
  const activeRole = ref<ActiveRole | null>(
    storage.get<ActiveRole>(STORAGE_KEYS.activeRole),
  )

  const status = computed<AuthStatus>(() =>
    accessToken.value && user.value ? 'authenticated' : 'anonymous',
  )
  const isAuthenticated = computed(() => status.value === 'authenticated')
  const hasBothRoles = computed(
    () => !!user.value && user.value.is_tenant && user.value.is_landlord,
  )

  function setActiveRole(role: ActiveRole | null) {
    activeRole.value = role
    if (role) storage.set(STORAGE_KEYS.activeRole, role)
    else storage.remove(STORAGE_KEYS.activeRole)
  }

  /**
   * Persist a freshly authenticated session and derive the active role.
   * Returns `false` if the backend returned a user with neither role flag —
   * in that case nothing is persisted and the caller should surface an error.
   */
  function persistSession(payload: { access: string; refresh: string; user: User }): boolean {
    const u = payload.user
    if (!u.is_tenant && !u.is_landlord) {
      clearSession()
      return false
    }

    accessToken.value = payload.access
    refreshToken.value = payload.refresh
    user.value = u
    storage.set(STORAGE_KEYS.accessToken, payload.access)
    storage.set(STORAGE_KEYS.refreshToken, payload.refresh)
    storage.set(STORAGE_KEYS.user, u)

    // Reconcile activeRole against the fresh user flags.
    // Single-role users are auto-assigned; dual-role users keep their prior
    // choice if still valid, otherwise fall through to the picker (null).
    const persisted = storage.get<ActiveRole>(STORAGE_KEYS.activeRole)
    let next: ActiveRole | null = null
    if (u.is_tenant && u.is_landlord) {
      next = persisted === 'tenant' || persisted === 'landlord' ? persisted : null
    } else if (u.is_landlord) {
      next = 'landlord'
    } else if (u.is_tenant) {
      next = 'tenant'
    }
    setActiveRole(next)
    return true
  }

  function updateTokens(payload: { access: string; refresh: string }) {
    accessToken.value = payload.access
    refreshToken.value = payload.refresh
    storage.set(STORAGE_KEYS.accessToken, payload.access)
    storage.set(STORAGE_KEYS.refreshToken, payload.refresh)
  }

  function clearSession() {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    activeRole.value = null
    storage.remove(STORAGE_KEYS.accessToken)
    storage.remove(STORAGE_KEYS.refreshToken)
    storage.remove(STORAGE_KEYS.user)
    storage.remove(STORAGE_KEYS.activeRole)
  }

  async function register(payload: RegisterPayload) {
    return authService.register(payload)
  }

  function logout() {
    clearSession()
  }

  return {
    user,
    accessToken,
    refreshToken,
    activeRole,
    status,
    isAuthenticated,
    hasBothRoles,
    register,
    persistSession,
    updateTokens,
    setActiveRole,
    logout,
  }
})
