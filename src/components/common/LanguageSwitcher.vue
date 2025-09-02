<template>
  <a-dropdown placement="bottomRight">
    <div 
      class="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg transition-colors"
      :class="switcherClasses"
    >
      <span class="text-lg">{{ currentFlag }}</span>
      <span v-if="!props.compact" :class="textClasses">{{ currentName }}</span>
      <down-outlined v-if="!props.compact" :class="iconClasses" />
    </div>
    <template #overlay>
      <a-menu>
        <a-menu-item 
          v-for="localeOption in locales" 
          :key="localeOption.code"
          @click="() => handleLocaleChange(localeOption.code)"
          :class="{ 'bg-blue-50': localeOption.code === currentLocale }"
        >
          <div class="flex items-center gap-3">
            <span class="text-lg">{{ localeOption.flag }}</span>
            <span>{{ localeOption.name }}</span>
            <check-outlined v-if="localeOption.code === currentLocale" class="text-blue-500 ml-auto" />
          </div>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DownOutlined, CheckOutlined } from '@ant-design/icons-vue'
import { useI18nStore, type SupportedLocale } from '@/stores/i18n'

interface Props {
  compact?: boolean
  variant?: 'dark' | 'light' | 'transparent'
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
  variant: 'dark'
})

const i18nStore = useI18nStore()

// Direct access to store computed properties
const currentLocale = computed(() => i18nStore.locale)
const locales = computed(() => i18nStore.availableLocales)

const currentLocaleInfo = computed(() => {
  return locales.value.find((l) => l.code === currentLocale.value) || locales.value[0]
})

const currentFlag = computed(() => currentLocaleInfo.value?.flag || '🇺🇸')
const currentName = computed(() => currentLocaleInfo.value?.name || 'English')

// Dynamic classes based on variant
const switcherClasses = computed(() => {
  switch (props.variant) {
    case 'light':
      return 'hover:bg-gray-100 bg-white/80 backdrop-blur-sm border border-gray-200'
    case 'transparent':
      return 'hover:bg-white/10 bg-white/5 backdrop-blur-sm border border-white/20'
    default: // dark
      return 'hover:bg-slate-700'
  }
})

const textClasses = computed(() => {
  switch (props.variant) {
    case 'light':
      return 'text-gray-800 text-sm'
    case 'transparent':
      return 'text-white text-sm'
    default: // dark
      return 'text-white text-sm'
  }
})

const iconClasses = computed(() => {
  switch (props.variant) {
    case 'light':
      return 'text-gray-500 text-xs'
    case 'transparent':
      return 'text-white/70 text-xs'
    default: // dark
      return 'text-gray-400 text-xs'
  }
})

// Handle locale change
const handleLocaleChange = (localeCode: SupportedLocale) => {
  console.log('Changing locale to:', localeCode)
  i18nStore.setLocale(localeCode)
  console.log('Locale changed to:', i18nStore.locale)
}
</script>
