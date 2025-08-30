// Airtable base types
export interface AirtableRecord<T = any> {
  id: string
  fields: T
  createdTime: string
}

export interface AirtableResponse<T = any> {
  records: AirtableRecord<T>[]
  offset?: string
}

export interface AirtableError {
  type: string
  message: string
}

// Agent record fields from Airtable
export interface AgentFields {
  number: number
  agent_name: string
  agent_surname: string
  appointments?: string[] // Array of record IDs
  color: string
}

// Appointment record fields from Airtable
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

// Contact record fields from Airtable
export interface ContactFields {
  contact_id: string
  contact_name: string
  contact_surname: string
  contact_email: string
  contact_phone: string
  contact_address?: string
}

// Airtable API request options
export interface AirtableRequestOptions {
  pageSize?: number
  sort?: Array<{
    field: string
    direction: 'asc' | 'desc'
  }>
  filterByFormula?: string
  fields?: string[]
  view?: string
}
