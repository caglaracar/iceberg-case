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
  const fetchContacts = async (options: {pageSize?: number; filterByFormula?: string} = {}): Promise<Contact[]> => {
    loading.value = true
    error.value = null

    try {
      const params: any = {
        pageSize: options.pageSize || 100,
        sort: JSON.stringify([{
          field: 'contact_name',
          direction: 'asc'
        }])
      }

      if (options.filterByFormula) {
        params.filterByFormula = options.filterByFormula
      }

      const response = await api.get(`/${baseId}/Contacts`, { params })
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

  // Search contacts
  const searchContacts = async (searchTerm: string): Promise<Contact[]> => {
    if (!searchTerm.trim()) {
      return fetchContacts()
    }

    const formula = `OR(
      SEARCH(LOWER("${searchTerm}"), LOWER({contact_name})),
      SEARCH(LOWER("${searchTerm}"), LOWER({contact_surname})),
      SEARCH(LOWER("${searchTerm}"), LOWER({contact_email}))
    )`

    return fetchContacts({ filterByFormula: formula })
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

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    searchContacts,
    getContact,
    totalContacts: computed(() => contacts.value.length)
  }
}
