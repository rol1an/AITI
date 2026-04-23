import { readonly, ref } from 'vue'

import { localeLabels, messages } from './messages'
import { aitiMessages } from './aitiMessages'
import { DEFAULT_LOCALE, type AppLocale } from './types'

const STORAGE_KEY = 'aiti:locale'
const currentLocale = ref<AppLocale>(DEFAULT_LOCALE)

function mergeDeep(target: unknown, source: unknown): unknown {
  if (typeof source !== 'object' || source === null) {
    return source !== undefined ? source : target
  }

  if (!target || typeof target !== 'object' || Array.isArray(target) || Array.isArray(source)) {
    return source
  }

  const output = { ...(target as Record<string, unknown>) }
  for (const [key, value] of Object.entries(source as Record<string, unknown>)) {
    output[key] = key in output ? mergeDeep(output[key], value) : value
  }
  return output
}

function getLocaleMessages(locale: AppLocale) {
  const base = messages[locale] ?? messages['zh-CN']
  const overlay = (aitiMessages as Record<string, unknown>)[locale] ?? aitiMessages['zh-CN']
  return mergeDeep(base, overlay) as typeof messages['zh-CN']
}

function normalizeLocale(input?: string | null): AppLocale | null {
  if (!input) return null
  const lower = input.toLowerCase()

  if (lower.startsWith('zh-tw') || lower.startsWith('zh_tw')) return 'zh-TW'
  if (lower.startsWith('zh')) return 'zh-CN'
  if (lower.startsWith('en')) return 'en'
  if (lower.startsWith('ja')) return 'ja'

  return null
}

function applyDocumentLanguage(locale: AppLocale) {
  if (typeof document === 'undefined') return
  document.documentElement.lang = locale
}

function readStoredLocale(): AppLocale | null {
  if (typeof window === 'undefined') return null
  return normalizeLocale(window.localStorage.getItem(STORAGE_KEY))
}

function detectSystemLocale(): AppLocale {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE
  const candidates = [...(navigator.languages ?? []), navigator.language]
  for (const item of candidates) {
    const matched = normalizeLocale(item)
    if (matched) return matched
  }
  return DEFAULT_LOCALE
}

export function initI18n() {
  const urlLang = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('lang')
    : null
  const fromUrl = urlLang ? normalizeLocale(urlLang) : null
  const locale = fromUrl ?? readStoredLocale() ?? detectSystemLocale() ?? DEFAULT_LOCALE
  currentLocale.value = locale
  if (fromUrl) {
    // Persist so the rest of the session keeps the chosen language
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, locale)
    }
  }
  applyDocumentLanguage(currentLocale.value)
}

function deepGet(target: unknown, path: string) {
  return path.split('.').reduce<unknown>((value, key) => {
    if (!value || typeof value !== 'object') return undefined
    return (value as Record<string, unknown>)[key]
  }, target)
}

function interpolate(template: string, params?: Record<string, string | number>) {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? ''))
}

export function setLocale(locale: AppLocale) {
  currentLocale.value = locale
  applyDocumentLanguage(locale)

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, locale)
  }
}

export function getLocale() {
  return currentLocale.value
}

export function t(key: string, params?: Record<string, string | number>, defaultVal?: string) {
  const value = deepGet(getLocaleMessages(currentLocale.value), key) ?? deepGet(getLocaleMessages(DEFAULT_LOCALE), key)
  return interpolate(typeof value === 'string' ? value : (defaultVal ?? key), params)
}

export function tm<T>(key: string): T {
  return (deepGet(getLocaleMessages(currentLocale.value), key) ?? deepGet(getLocaleMessages(DEFAULT_LOCALE), key)) as T
}

export function useI18n() {
  return {
    locale: readonly(currentLocale),
    localeOptions: [
      { code: 'zh-CN' as AppLocale, label: localeLabels['zh-CN'] },
      { code: 'en' as AppLocale, label: localeLabels['en'] },
    ],
    setLocale,
    t,
    tm,
  }
}

export type { AppLocale } from './types'
