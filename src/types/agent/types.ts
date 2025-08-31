// Agent domain types

// Main Agent entity
export interface Agent {
  id: string
  number: string
  name: string
  firstName: string
  lastName: string
  color: string
  appointments: string[]
  createdTime: string
}

// Create agent form data
export interface CreateAgentData {
  firstName: string
  lastName: string
  number: string
  color: string
}

// Update agent data
export interface UpdateAgentData {
  firstName?: string
  lastName?: string
  number?: string
  color?: string
}

// Agent filters
export interface AgentFilters {
  search?: string
  status?: 'active' | 'inactive' | 'all'
}

// Agent table props
export interface AgentTableProps {
  agents: Agent[]
  loading?: boolean
}

export interface AgentTableEmits {
  'agent:edit': [agent: Agent]
  'agent:delete': [agentId: string]
  'agent:view': [agent: Agent]
}

// Agent select props (for forms)
export interface AgentSelectProps {
  modelValue?: string | string[]
  multiple?: boolean
  loading?: boolean
  disabled?: boolean
  placeholder?: string
}

export interface AgentSelectEmits {
  'update:modelValue': [value: string | string[]]
}
