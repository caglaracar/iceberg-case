import { useI18nStore, type SupportedLocale, type NestedTranslationKey } from '@/stores/i18n'

export type { SupportedLocale, NestedTranslationKey }

export const useI18n = () => {
  const store = useI18nStore()

  return {
    t: store.t,
    locale: store.locale,
    setLocale: store.setLocale,
    toggleLocale: store.toggleLocale,
    availableLocales: store.availableLocales,
    isRTL: store.isRTL,
    currentTranslations: store.currentTranslations
  }
}
