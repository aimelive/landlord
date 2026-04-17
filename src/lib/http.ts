import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { env } from "../config/env";
import { STORAGE_KEYS, storage } from "./storage";

export interface ApiError {
  status: number;
  fieldErrors: Record<string, string>;
  formError: string | null;
  raw: unknown;
}

export function isApiError(e: unknown): e is ApiError {
  return !!e && typeof e === "object" && "fieldErrors" in e && "formError" in e;
}

/**
 * DRF returns errors in several shapes:
 *   { field: ["msg", ...] }           - serializer field errors
 *   { non_field_errors: [...] }       - cross-field serializer errors
 *   { detail: "msg" }                 - view-level (APIException, auth)
 *   "msg" | ["msg"]                   - occasionally from custom views
 *
 * Normalise to { fieldErrors, formError } so components never parse DRF.
 * Takes the raw AxiosError so we can distinguish timeouts from plain
 * network failures and from DRF responses.
 */
function normalizeDrfError(
  status: number,
  error: AxiosError | unknown,
): ApiError {
  const axiosErr = error as AxiosError;
  const data = axiosErr?.response?.data;
  const fieldErrors: Record<string, string> = {};
  let formError: string | null = null;

  const pickFirst = (v: unknown): string =>
    Array.isArray(v) ? String(v[0] ?? "") : String(v ?? "");

  if (data && typeof data === "object" && !Array.isArray(data)) {
    const obj = data as Record<string, unknown>;
    if (typeof obj.detail === "string") formError = obj.detail;
    if (obj.non_field_errors)
      formError = pickFirst(obj.non_field_errors) || formError;

    for (const [key, val] of Object.entries(obj)) {
      if (key === "detail" || key === "non_field_errors") continue;
      const msg = pickFirst(val);
      if (msg) fieldErrors[key] = msg;
    }
  } else if (typeof data === "string") {
    formError = data;
  } else if (Array.isArray(data)) {
    formError = pickFirst(data);
  }

  if (!formError && Object.keys(fieldErrors).length === 0) {
    if (axiosErr?.code === "ECONNABORTED") {
      formError = "The request took too long. Please try again.";
    } else if (status === 0) {
      formError = "Cannot reach the server. Check your connection.";
    } else if (status >= 500) {
      formError = "Something went wrong on our end. Please try again.";
    } else {
      formError = "Request failed. Please try again.";
    }
  }

  return { status, fieldErrors, formError, raw: data };
}

export const http: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = storage.get<string>(STORAGE_KEYS.accessToken);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Single in-flight refresh promise so N parallel 401s trigger at most one
// /auth/token/refresh/ call. Backend rotates refresh tokens on each call.
let refreshInFlight: Promise<string> | null = null;

async function performRefresh(): Promise<string> {
  const refresh = storage.get<string>(STORAGE_KEYS.refreshToken);
  if (!refresh) throw new Error("no-refresh-token");
  // Plain axios - bypasses this interceptor so a failed refresh can't recurse.
  const { data } = await axios.post<{ access: string; refresh: string }>(
    `${env.apiBaseUrl}/auth/token/refresh/`,
    { refresh },
    { headers: { "Content-Type": "application/json" }, timeout: 15_000 },
  );
  const { useAuthStore } = await import("../stores/auth.store");
  useAuthStore().updateTokens({ access: data.access, refresh: data.refresh });
  return data.access;
}

function getOrStartRefresh(): Promise<string> {
  if (!refreshInFlight) {
    refreshInFlight = performRefresh().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

async function forceLogout() {
  const [{ useAuthStore }, routerMod] = await Promise.all([
    import("../stores/auth.store"),
    import("../router/index"),
  ]);
  useAuthStore().logout();
  const router = routerMod.default;
  const currentPath = router.currentRoute.value.fullPath;
  if (!currentPath.startsWith("/login")) {
    router.push({ path: "/login", query: { next: currentPath } });
  }
}

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status ?? 0;
    const config = error.config as RetriableConfig | undefined;
    const hadAuthHeader = !!config?.headers?.Authorization;

    // 401 on an authenticated request: try a silent refresh once, then retry.
    // Skip if: no auth header (e.g. login itself), already retried (avoid loop),
    // or no config to replay.
    if (status === 401 && hadAuthHeader && config && !config._retry) {
      try {
        const newAccess = await getOrStartRefresh();
        config._retry = true;
        config.headers.Authorization = `Bearer ${newAccess}`;
        return http(config);
      } catch {
        await forceLogout();
      }
    } else if (status === 401 && hadAuthHeader) {
      await forceLogout();
    }

    const apiError = normalizeDrfError(status, error);
    return Promise.reject(apiError);
  },
);
