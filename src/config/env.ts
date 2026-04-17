interface AppEnv {
  apiBaseUrl: string
  storageNamespace: string
  storageSecret: string
  isProd: boolean
}

function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing required env var ${name}`)
  return value
}

export const env: AppEnv = {
  apiBaseUrl: required('VITE_API_BASE_URL', import.meta.env.VITE_API_BASE_URL),
  storageNamespace: import.meta.env.VITE_STORAGE_NAMESPACE ?? 'll',
  storageSecret: required('VITE_STORAGE_SECRET', import.meta.env.VITE_STORAGE_SECRET),
  isProd: import.meta.env.PROD,
}
