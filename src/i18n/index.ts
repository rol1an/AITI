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

function getLocaleMessages(_locale: AppLocale) {
  // 多语言暂时冻结，所有 locale 统一使用 zh-CN
  const base = messages['zh-CN']
  const overlay = aitiMessages['zh-CN' as keyof typeof aitiMessages]
  return mergeDeep(base, overlay) as typeof base
}

function normalizeLocale(input?: string | null): AppLocale | null {
  if (!input) return null
  const lower = input.toLowerCase()

  // 多语言暂时冻结，所有语言统一返回 zh-CN
  if (lower.startsWith('zh')) return 'zh-CN'

  return 'zh-CN'
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
  currentLocale.value = readStoredLocale() ?? detectSystemLocale() ?? DEFAULT_LOCALE
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
    // 多语言暂时冻结，只暴露 zh-CN 选项
    localeOptions: [{ code: 'zh-CN' as AppLocale, label: localeLabels['zh-CN'] }],
    setLocale,
    t,
    tm,
  }
}

export type { AppLocale } from './types'
