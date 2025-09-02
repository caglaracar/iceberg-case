# 🧊 Iceberg - Appointment Management System

A modern, comprehensive appointment management system built with Vue 3, featuring advanced authentication, internationalization, and a beautiful user interface.

## 📋 Project Overview
Proejct Link : https://icebergcase.netlify.app/home

Iceberg is a full-featured CRM and appointment management platform designed for businesses to efficiently manage appointments, contacts, and agents. The system includes JWT authentication, multi-language support, responsive design, and seamless API integration with Airtable.

## 🚀 Key Features

- **JWT Authentication System** - Secure token-based authentication with route protection
- **Multi-language Support** - English and Turkish with reactive language switching
- **Appointment Management** - Create, read, update, and delete appointments
- **Contact Management** - Comprehensive contact database with search functionality
- **Agent Management** - Agent assignment and color-coded visualization
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Real-time Filtering** - Advanced search and filter capabilities
- **Modal System** - Reusable modal components with proper UX
- **Notification System** - Toast notifications for user feedback
- **State Management** - Global state with Pinia and caching strategies

## 🛠️ Technology Stack

### Frontend Framework
- **Vue 3** - Composition API with `<script setup>` syntax
- **TypeScript** - Full type safety and IntelliSense support
- **Vite** - Fast build tool and development server

### UI & Styling
- **Ant Design Vue** - Comprehensive UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **CSS3** - Custom styling and responsive design

### State Management & Data
- **Pinia** - Modern state management for Vue 3
- **Axios** - HTTP client with interceptors
- **DayJS** - Modern date/time manipulation library

### Development & Build Tools
- **ESLint** - Code linting and quality assurance
- **PostCSS** - CSS processing and optimization
- **Vite Config** - Custom build configuration

### External Integrations
- **Airtable API** - Database and record management
- **JWT Tokens** - Secure authentication mechanism

## 📁 Project Structure

```
src/
├── assets/           # Static assets (CSS, images, icons)
├── components/       # Reusable Vue components
│   ├── appointment/  # Appointment-specific components
│   ├── common/       # Shared UI components
│   └── login/        # Authentication components
├── composables/      # Vue 3 composables for logic reuse
│   ├── agent/        # Agent-related composables
│   ├── appointment/  # Appointment management logic
│   └── contact/      # Contact management logic
├── constants/        # Application constants and enums
├── layout/           # Layout components (header, sidebar)
├── locales/          # i18n translation files
│   ├── en.json       # English translations
│   └── tr.json       # Turkish translations
├── pages/            # Page components
├── router/           # Vue Router configuration
├── services/         # API services and utilities
├── shared/           # Shared components and utilities
├── stores/           # Pinia stores
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## 🔐 Authentication System

The application features a robust JWT-based authentication system:

- **Secure Cookie Storage** - JWT tokens stored in HTTP-only cookies
- **Route Guards** - Protected routes with automatic redirects
- **Token Refresh** - Automatic token validation and refresh
- **Demo Credentials** - `admin@iceberg.com` / `admin123`

### Authentication Flow
1. User logs in with credentials
2. JWT token generated and stored securely
3. Axios interceptors attach tokens to requests
4. Route guards protect authenticated pages
5. Automatic logout on token expiry

## 🌍 Internationalization (i18n)

Full multi-language support with reactive language switching:

- **Supported Languages** - English (`en`) and Turkish (`tr`)
- **Translation Keys** - Nested JSON structure for organization
- **Language Switcher** - Global component with flag icons
- **Persistent Storage** - Language preference saved in localStorage
- **Type Safety** - TypeScript support for translation keys

### Usage Example
```typescript
import { useI18n } from '@/composables/useI18n'

const { t, locale, setLocale } = useI18n()
const title = t('appointments.title')
```

## 📊 State Management

Global state management using Pinia with caching strategies:

### Stores
- **Authentication Store** - User state and JWT management
- **Global Search Store** - Cross-component search functionality
- **i18n Store** - Language state and translations

### Composables with Global State
- **useAgents()** - Agent data with 5-minute caching
- **useContacts()** - Contact data with global state
- **useAppointments()** - Appointment CRUD operations

## 🎨 UI Components

### Shared Components
- **StatusBadge** - Status visualization with date/time
- **ConfirmationModal** - Reusable confirmation dialogs
- **LanguageSwitcher** - Language selection dropdown

### Feature Components
- **AppointmentModal** - Create/Edit/View appointments
- **AppointmentTable** - Sortable, filterable data table
- **AppointmentFilters** - Advanced filtering interface

## 📱 Responsive Design

Mobile-first approach with breakpoint-aware design:
- **Tailwind Breakpoints** - sm, md, lg, xl responsive utilities
- **Mobile Optimization** - Touch-friendly interfaces
- **Adaptive Layouts** - Grid systems that collapse on mobile
- **Modal Behavior** - Full-screen modals on mobile devices

## 🔧 API Integration

Seamless integration with Airtable API:

### Features
- **Automatic Retries** - Built-in error handling
- **Request Interceptors** - API key injection
- **Response Interceptors** - Error handling and notifications
- **Caching Strategy** - Reduce API calls with smart caching
- **Batch Operations** - Efficient data fetching

### Environment Variables
```bash
VITE_AIRTABLE_BASE_ID=your_base_id
VITE_AIRTABLE_API_KEY=your_api_key
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd iceberg-case
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp .env.example .env
# Edit .env with your Airtable credentials
```

4. **Start development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
```

### Demo Access
- **Email**: `admin@iceberg.com`
- **Password**: `admin123`

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Core Features Walkthrough

### 1. Appointment Management
- Create new appointments with contact selection
- Edit existing appointments with validation
- View detailed appointment information
- Delete appointments with confirmation
- Filter by status, agent, date range, and search terms

### 2. Contact System
- Global contact database with caching
- Search contacts by name, email, or phone
- Contact selection in appointment forms
- Related appointments view per contact

### 3. Agent Management
- Agent assignment to appointments
- Color-coded agent visualization
- Multi-agent appointment support
- Agent filtering and search

### 4. Authentication & Security
- JWT token-based authentication
- Secure route protection
- Automatic session management
- Cookie-based token storage

## 🔄 Development Workflow

### Code Organization
- **Composition API** - Modern Vue 3 patterns
- **TypeScript** - Full type safety
- **Modular Architecture** - Reusable composables and components
- **Consistent Naming** - Clear file and function naming conventions

### Performance Optimizations
- **Lazy Loading** - Route-based code splitting
- **Caching** - Smart API request caching
- **Debounced Search** - Optimized search performance
- **Virtual Scrolling** - Efficient large list rendering

## 📖 Documentation

### Key Concepts
- **Composables** - Reusable logic with Vue 3 Composition API
- **Global State** - Singleton pattern for shared data
- **Type Safety** - Comprehensive TypeScript integration
- **Reactive UI** - Real-time state updates across components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper TypeScript types
4. Add/update tests if applicable
5. Submit a pull request
6. Netlify : https://icebergcase.netlify.app/home


**Built with ❤️ using Vue 3, TypeScript, and modern web technologies.**
