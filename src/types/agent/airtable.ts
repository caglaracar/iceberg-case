// Airtable-specific types for Agents

// Airtable agent record fields
export interface AgentFields {
  agent_name?: string
  agent_surname?: string
  number?: string
  color?: string
  appointments?: string[]
}

// Generic Airtable record structure
export interface AirtableAgentRecord {
  id: string
  fields: AgentFields
  createdTime: string
}

// Airtable API response
export interface AirtableAgentResponse {
  records: AirtableAgentRecord[]
  offset?: string
}
