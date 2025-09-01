import { ref, computed, type Ref } from 'vue'
import api from '@/services/api'
import type { Agent } from '@/types/agent'
import type { AirtableAgentRecord } from '@/types/agent'

// Global state for agents - singleton pattern
const globalAgents: Ref<Agent[]> = ref([])
const globalLoading: Ref<boolean> = ref(false)
const globalError: Ref<string | null> = ref(null)
const agentsCache: Ref<Agent[] | null> = ref(null)
const lastFetchTime: Ref<number | null> = ref(null)
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes cache

export function useAgents() {
  const agents = globalAgents
  const loading = globalLoading
  const error = globalError

  const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID

  // Transform Airtable agent record
  const transformAgent = (record: AirtableAgentRecord): Agent => {
    const fields = record.fields
    
    return {
      id: record.id,
      number: fields.number || '',
      name: `${fields.agent_name || ''} ${fields.agent_surname || ''}`.trim(),
      firstName: fields.agent_name || '',
      lastName: fields.agent_surname || '',
      color: fields.color || '',
      appointments: fields.appointments || [],
      createdTime: record.createdTime
    }
  }

  // Fetch all agents with caching
  const fetchAgents = async (): Promise<Agent[]> => {
    // Check if we have valid cached data
    const now = Date.now()
    if (agentsCache.value && lastFetchTime.value && (now - lastFetchTime.value) < CACHE_DURATION) {
      agents.value = agentsCache.value
      return agentsCache.value
    }
    
    // Prevent multiple simultaneous requests
    if (loading.value) {
      // Wait for current request to finish
      while (loading.value) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return agents.value
    }

    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/${baseId}/Agents`)
      const transformedRecords: Agent[] = response.data.records.map(transformAgent)
      
      // Update global cache
      agents.value = transformedRecords
      agentsCache.value = transformedRecords
      lastFetchTime.value = now
      
      return transformedRecords
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch agents'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Search agents - use cache first
  const searchAgents = async (searchTerm: string): Promise<Agent[]> => {
    // Ensure we have agents (will use cache if available)
    await fetchAgents()
    
    if (!searchTerm.trim()) {
      return agents.value
    }

    return agents.value.filter(agent => 
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
