import { ref, computed, type Ref } from 'vue'
import api from '@/services/api.ts'
import type { Contact } from '@/types/contact'
import type { AirtableContactRecord } from '@/types/contact'

// Global state for contacts - singleton pattern
const globalContacts: Ref<Contact[]> = ref([])
const globalLoading: Ref<boolean> = ref(false)
const globalError: Ref<string | null> = ref(null)
const contactsCache: Ref<Contact[] | null> = ref(null)
const lastFetchTime: Ref<number | null> = ref(null)
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes cache

export function useContacts() {
  const contacts = globalContacts
  const loading = globalLoading
  const error = globalError

  const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID

  // Transform Airtable contact record
  const transformContact = (record: AirtableContactRecord): Contact => {
    const fields = record.fields
    return {
      id: record.id,
      contactId: fields.contact_id || '',
      name: fields.contact_name || '',
      surname: fields.contact_surname || '',
      email: fields.contact_email || '',
      phone: fields.contact_phone || '',
      createdTime: record.createdTime,
      
      // Computed properties
      fullName: `${fields.contact_name || ''} ${fields.contact_surname || ''}`.trim(),
      initials: `${fields.contact_name?.[0] || ''}${fields.contact_surname?.[0] || ''}`.toUpperCase()
    }
  }

  // Fetch all contacts with caching
  const fetchContacts = async (): Promise<Contact[]> => {
    // Check if we have valid cached data
    const now = Date.now()
    if (contactsCache.value && lastFetchTime.value && (now - lastFetchTime.value) < CACHE_DURATION) {
      contacts.value = contactsCache.value
      return contactsCache.value
    }
    
    // Prevent multiple simultaneous requests
    if (loading.value) {
      // Wait for current request to finish
      while (loading.value) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return contacts.value
    }

    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/${baseId}/Contacts`)
      const transformedRecords: Contact[] = response.data.records.map(transformContact)
      
      // Update global cache
      contacts.value = transformedRecords
      contactsCache.value = transformedRecords
      lastFetchTime.value = now
      
      return transformedRecords
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch contacts'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Search contacts (client-side filtering)
  const searchContacts = (searchTerm: string): Contact[] => {
    if (!searchTerm.trim()) {
      return contacts.value
    }

    const term = searchTerm.toLowerCase()
    return contacts.value.filter(contact => 
      contact.name.toLowerCase().includes(term) ||
      contact.surname.toLowerCase().includes(term) ||
      contact.email.toLowerCase().includes(term) ||
      contact.fullName.toLowerCase().includes(term)
    )
  }


  // Contact lookup utilities
  const contactMap = computed(() => {
    const map = new Map<string, Contact>()
    contacts.value.forEach(contact => {
      map.set(contact.id, contact)
    })
    return map
  })

  const getContactById = (id: string): Contact | undefined => {
    return contactMap.value.get(id)
  }

  const getContactName = (id: string): string => {
    const contact = getContactById(id)
    return contact?.fullName || 'Unknown Contact'
  }

  const getContactEmail = (id: string): string => {
    const contact = getContactById(id)
    return contact?.email || ''
  }

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    searchContacts,
    totalContacts: computed(() => contacts.value.length),
    // Lookup utilities
    contactMap,
    getContactById,
    getContactName,
    getContactEmail
  }
}
