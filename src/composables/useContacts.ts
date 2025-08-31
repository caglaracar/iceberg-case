import { ref, computed, type Ref } from 'vue'
import api from '@/services/api'
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

  // Get contact by ID
  const getContact = async (recordId: string): Promise<Contact> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/${baseId}/Contacts/${recordId}`)
      return transformContact(response.data)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch contact'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create new contact
  const createContact = async (contactData: {
    name: string
    surname: string
    email: string
    phone: string
  }): Promise<Contact> => {
    loading.value = true
    error.value = null

    try {
      const payload = {
        records: [{
          fields: {
            contact_name: contactData.name,
            contact_surname: contactData.surname,
            contact_email: contactData.email,
            contact_phone: contactData.phone
          }
        }]
      }

      const response = await api.post(`/${baseId}/Contacts`, payload)
      const newContact = transformContact(response.data.records[0])
      
      // Add to local state
      contacts.value.unshift(newContact)
      
      return newContact
    } catch (err: any) {
      error.value = err.message || 'Failed to create contact'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    searchContacts,
    getContact,
    createContact,
    totalContacts: computed(() => contacts.value.length)
  }
}
