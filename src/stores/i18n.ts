import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import enTranslations from '@/locales/en.json'
import trTranslations from '@/locales/tr.json'

// Supported languages
export type SupportedLocale = 'en' | 'tr'

// Translation type based on the JSON structure
export type TranslationKey = keyof typeof enTranslations
export type NestedTranslationKey<T = typeof enTranslations> = {
  [K in keyof T]: T[K] extends object 
    ? `${K & string}.${keyof T[K] & string}`
    : K & string
}[keyof T]

// Available translations
const translations = {
  en: enTranslations,
  tr: trTranslations
}

// Get value from nested object using dot notation
const getNestedValue = (obj: any, path: string): string => {
  return path.split('.').reduce((current, key) => current?.[key], obj) || path
}

// Get stored locale from localStorage or default to 'en'
const getStoredLocale = (): SupportedLocale => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('locale') as SupportedLocale
    if (stored && (stored === 'en' || stored === 'tr')) {
      return stored
    }
  }
  return 'en'
}

export const useI18nStore = defineStore('i18n', () => {
  // State
  const currentLocale = ref<SupportedLocale>(getStoredLocale())

  // Getters
  const locale = computed(() => currentLocale.value)
  
  const currentTranslations = computed(() => translations[currentLocale.value])

  const availableLocales = computed(() => [
    { code: 'en' as const, name: 'English', flag: '🇺🇸' },
    { code: 'tr' as const, name: 'Türkçe', flag: '🇹🇷' }
  ])

  const isRTL = computed(() => false) // Neither English nor Turkish are RTL

  // Actions
  const setLocale = (newLocale: SupportedLocale) => {
    currentLocale.value = newLocale
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale)
    }
  }

  const toggleLocale = () => {
    setLocale(currentLocale.value === 'en' ? 'tr' : 'en')
  }

  // Translation function with parameter substitution
  const t = (key: NestedTranslationKey, params?: Record<string, string | number>): string => {
    let translation = getNestedValue(currentTranslations.value, key)
    
    // Handle parameter substitution
    if (params && typeof translation === 'string') {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue))
      })
    }
    
    return translation
  }

  return {
    // State
    currentLocale,
    
    // Getters
    locale,
    currentTranslations,
    availableLocales,
    isRTL,
    
    // Actions
    setLocale,
    toggleLocale,
    t
  }
})

// Export for use in other composables without reactivity
export const i18nGlobal = {
  getCurrentLocale: () => {
    const store = useI18nStore()
    return store.locale
  },
  getTranslation: (key: NestedTranslationKey, params?: Record<string, string | number>) => {
    const store = useI18nStore()
    return store.t(key, params)
  }
}
