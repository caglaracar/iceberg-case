// Contact domain types

// Main Contact entity
export interface Contact {
  id: string
  contactId: string
  name: string
  surname: string
  email: string
  phone: string
  address?: string
  createdTime: string
  // Computed properties
  fullName: string
  initials: string
}

// Create contact form data
export interface CreateContactData {
  name: string
  surname: string
  email: string
  phone: string
  address?: string
}

// Update contact data
export interface UpdateContactData {
  name?: string
  surname?: string
  email?: string
  phone?: string
  address?: string
}

// Contact filters
export interface ContactFilters {
  search?: string
  hasEmail?: boolean
  hasPhone?: boolean
}

// Contact table props
export interface ContactTableProps {
  contacts: Contact[]
  loading?: boolean
}

export interface ContactTableEmits {
  'contact:edit': [contact: Contact]
  'contact:delete': [contactId: string]
  'contact:view': [contact: Contact]
  'contact:select': [contact: Contact]
}

// Contact select props (for forms)
export interface ContactSelectProps {
  modelValue?: string
  loading?: boolean
  disabled?: boolean
  placeholder?: string
  allowCreate?: boolean
}

export interface ContactSelectEmits {
  'update:modelValue': [value: string]
  'contact:create': [contactData: CreateContactData]
}
