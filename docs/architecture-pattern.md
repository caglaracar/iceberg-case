# 🏗️ Iceberg Architecture Pattern

## 📂 Klasör Yapısı
```
src/
├── components/          # Sadece UI logic
├── pages/              # Business logic + API calls
├── composables/        # Reusable logic
├── types/              # TypeScript definitions
├── constants/          # Static data
├── utils/              # Pure functions
└── services/           # API layer
```

## 🎯 Sorumluluk Dağılımı

### 📄 **Pages** (Business Logic Owner)
- API calls
- State management
- Event handlers
- Data transformation

### 🧩 **Components** (Pure UI)
- Props alır, emit yapar
- UI rendering
- User interactions
- NO business logic

### 🔧 **Utils** (Pure Functions)
- Date formatting
- Validations
- Calculations
- NO side effects

### 📊 **Constants** (Static Data)
- Table columns
- Status options
- Configuration
- NO dynamic data

## 📝 Kod Örnekleri

### ❌ Component İçinde API
```vue
<script setup>
// YANLIŞ - Component içinde API call
const { appointments, fetchAppointments } = useAppointments()
onMounted(() => fetchAppointments())
</script>
```

### ✅ Page'de API, Component'e Prop
```vue
<!-- Page -->
<script setup>
const { appointments, fetchAppointments } = useAppointments()
const handleRefresh = () => fetchAppointments()
</script>

<template>
  <AppointmentTable 
    :appointments="appointments"
    @refresh="handleRefresh"
  />
</template>

<!-- Component -->
<script setup>
interface Props {
  appointments: Appointment[]
}
defineProps<Props>()
defineEmits<{ refresh: [] }>()
</script>
```

### ❌ Component İçinde Validation
```vue
<script setup>
// YANLIŞ - Component içinde validation logic
const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
</script>
```

### ✅ Utils'den Import
```vue
<script setup>
import { validateEmail } from '@/utils/validation'
// Temiz, test edilebilir, reusable
</script>
```

## 🔄 Data Flow Pattern

```
API Call (Page) → Transform (Page) → Props (Component) → Emit (Component) → Handler (Page)
```

Bu pattern ile:
- ✅ Components test edilebilir
- ✅ Logic reusable
- ✅ Clear separation of concerns
- ✅ No tight coupling
