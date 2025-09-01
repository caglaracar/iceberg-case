import { ref, computed, type Ref } from 'vue'
import api from '@/services/api.ts'
import type { Contact } from '@/types/contact'
import type { AirtableContactRecord } from '@/types/contact'

export function useContacts() {
  const contacts: Ref<Contact[]> = ref([])
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)

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

  // Fetch all contacts
  const fetchContacts = async (): Promise<Contact[]> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/${baseId}/Contacts`)
      const transformedRecords = response.data.records.map(transformContact)
      
      contacts.value = transformedRecords
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


  return {
    contacts,
    loading,
    error,
    fetchContacts,
    searchContacts,
    totalContacts: computed(() => contacts.value.length)
  }
}
