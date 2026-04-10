/**
 * useSeo — lightweight, dependency-free head manager for Vue 3 CSR SPAs.
 * Directly manipulates document.head and cleans up on component unmount.
 */
import { onUnmounted } from 'vue'

const SITE_NAME = 'LandLord'
const BASE_URL  = 'https://landlord.aimelive.com'
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.svg`
const DEFAULT_DESCRIPTION =
  'LandLord helps tenants track rent payments, build a rental credit score, and visualise month-by-month coverage — all in one modern dashboard.'

export interface SeoOptions {
  /** Page title (site name appended automatically) */
  title: string
  /** Meta description — 150–160 characters ideal */
  description?: string
  /** Absolute canonical URL for this page */
  canonical?: string
  /** Prevent indexing (use for auth & private pages) */
  noindex?: boolean
  /** Absolute OG/Twitter card image URL (1200×630) */
  ogImage?: string
  /** OG content type — defaults to "website" */
  ogType?: 'website' | 'article'
  /** JSON-LD structured-data objects to inject */
  jsonLd?: Record<string, unknown>[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function setTitle(text: string) {
  document.title = text
}

function setMeta(attr: 'name' | 'property', key: string, value: string): HTMLMetaElement {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
  return el
}

function setLink(rel: string, href: string): HTMLLinkElement {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
  return el
}

function addJsonLd(schema: Record<string, unknown>): HTMLScriptElement {
  const el = document.createElement('script')
  el.setAttribute('type', 'application/ld+json')
  el.setAttribute('data-seo', 'dynamic')
  el.textContent = JSON.stringify(schema)
  document.head.appendChild(el)
  return el
}

// ─── Composable ───────────────────────────────────────────────────────────────

export function useSeo(options: SeoOptions) {
  const description = options.description ?? DEFAULT_DESCRIPTION
  const ogImage     = options.ogImage    ?? DEFAULT_OG_IMAGE
  const canonical   = options.canonical  ?? BASE_URL
  const fullTitle   = `${options.title} | ${SITE_NAME}`
  const robots      = options.noindex
    ? 'noindex, nofollow'
    : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'

  // ── Apply ──
  const previousTitle = document.title
  setTitle(fullTitle)

  setMeta('name', 'description', description)
  setMeta('name', 'robots', robots)
  setMeta('name', 'author', SITE_NAME)
  setMeta('name', 'theme-color', '#031a60')
  setMeta('name', 'color-scheme', 'light')
  // Open Graph
  setMeta('property', 'og:title', fullTitle)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:type', options.ogType ?? 'website')
  setMeta('property', 'og:url', canonical)
  setMeta('property', 'og:site_name', SITE_NAME)
  setMeta('property', 'og:image', ogImage)
  setMeta('property', 'og:image:width', '1200')
  setMeta('property', 'og:image:height', '630')
  setMeta('property', 'og:image:alt', `${SITE_NAME} — Smart Rent Tracking`)
  setMeta('property', 'og:locale', 'en_US')
  // Twitter Card
  setMeta('name', 'twitter:card', 'summary_large_image')
  setMeta('name', 'twitter:title', fullTitle)
  setMeta('name', 'twitter:description', description)
  setMeta('name', 'twitter:image', ogImage)
  setMeta('name', 'twitter:image:alt', `${SITE_NAME} — Smart Rent Tracking`)

  setLink('canonical', canonical)

  const jsonLdEls: HTMLScriptElement[] = (options.jsonLd ?? []).map(addJsonLd)

  // ── Cleanup: restore previous state when component unmounts ──
  onUnmounted(() => {
    document.title = previousTitle
    // Remove JSON-LD tags added by this instance
    jsonLdEls.forEach((el) => el.parentNode?.removeChild(el))
  })
}
