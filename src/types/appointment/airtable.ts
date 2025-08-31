// Airtable-specific types for Appointments

// Airtable appointment record fields
export interface AppointmentFields {
  appointment_id?: string
  appointment_date?: string
  appointment_address?: string
  contact_id?: string[]
  contact_name?: string[]
  contact_surname?: string[]
  contact_email?: string[]
  contact_phone?: string[]
  agent_id?: string[]
  agent_name?: string[]
  agent_surname?: string[]
  is_cancelled?: boolean
}

// Generic Airtable record structure
export interface AirtableAppointmentRecord {
  id: string
  fields: AppointmentFields
  createdTime: string
}

// Airtable API response
export interface AirtableAppointmentResponse {
  records: AirtableAppointmentRecord[]
  offset?: string
}
