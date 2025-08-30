import { ref, computed, type Ref } from 'vue'
import api from '@/services/api'
import type { Agent } from '@/types/api'
import type { AirtableRecord, AgentFields } from '@/types/airtable'

export function useAgents() {
  const agents: Ref<Agent[]> = ref([])
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)

  const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID

  // Transform Airtable agent record
  const transformAgent = (record: AirtableRecord<AgentFields>): Agent => {
    const fields = record.fields
    
    return {
      id: record.id,
      number: fields.number,
      name: `${fields.agent_name || ''} ${fields.agent_surname || ''}`.trim(),
      firstName: fields.agent_name,
      lastName: fields.agent_surname,
      color: fields.color,
      appointments: fields.appointments || [],
      createdTime: record.createdTime
    }
  }

  // Fetch all agents - basit request
  const fetchAgents = async (): Promise<Agent[]> => {
    loading.value = true
    error.value = null

    try {
      // Önce sadece basit GET
      const response = await api.get(`/${baseId}/Agents`)
      const transformedRecords: Agent[] = response.data.records.map(transformAgent)
      
      agents.value = transformedRecords
      return transformedRecords
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch agents'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Search agents - basit version
  const searchAgents = async (searchTerm: string): Promise<Agent[]> => {
    // Şimdilik sadece tüm agents'ları getir, sonra client-side filter yap
    const allAgents = await fetchAgents()
    
    if (!searchTerm.trim()) {
      return allAgents
    }

    return allAgents.filter(agent => 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  // Get agent by ID
  const getAgent = async (recordId: string): Promise<Agent> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/${baseId}/Agents/${recordId}`)
      return transformAgent(response.data)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch agent'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    agents,
    loading,
    error,
    fetchAgents,
    searchAgents,
    getAgent,
    totalAgents: computed(() => agents.value.length)
  }
}
