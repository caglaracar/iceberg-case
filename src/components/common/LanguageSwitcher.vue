<template>
  <a-dropdown placement="bottomRight">
    <div class="flex items-center gap-2 cursor-pointer hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors">
      <span class="text-lg">{{ currentFlag }}</span>
      <span v-if="!props.compact" class="text-white text-sm">{{ currentName }}</span>
      <down-outlined v-if="!props.compact" class="text-gray-400 text-xs" />
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
}

const props = withDefaults(defineProps<Props>(), {
  compact: false
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

// Handle locale change
const handleLocaleChange = (localeCode: SupportedLocale) => {
  console.log('Changing locale to:', localeCode)
  i18nStore.setLocale(localeCode)
  console.log('Locale changed to:', i18nStore.locale)
}
</script>
