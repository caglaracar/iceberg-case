// Airtable-specific types for Contacts

// Airtable contact record fields
export interface ContactFields {
  contact_id?: string
  contact_name?: string
  contact_surname?: string
  contact_email?: string
  contact_phone?: string
  contact_address?: string
}

// Generic Airtable record structure
export interface AirtableContactRecord {
  id: string
  fields: ContactFields
  createdTime: string
}

// Airtable API response
export interface AirtableContactResponse {
  records: AirtableContactRecord[]
  offset?: string
}
