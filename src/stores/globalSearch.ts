import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAgents } from '@/composables/useAgents'
import { useRouter } from 'vue-router'

export const useGlobalSearchStore = defineStore('globalSearch', () => {
  // State
  const searchTerm = ref('')
  const isSearchOpen = ref(false)
  const selectedAgentIds = ref<string[]>([])
  
  // Composables
  const { agents, fetchAgents } = useAgents()
  const router = useRouter()
  
  // Computed
  const filteredAgents = computed(() => {
    if (!searchTerm.value.trim()) return []
    
    const search = searchTerm.value.toLowerCase()
    return agents.value.filter(agent => 
      agent.name.toLowerCase().includes(search) ||
      agent.firstName?.toLowerCase().includes(search) ||
      agent.lastName?.toLowerCase().includes(search) ||
      `${agent.firstName} ${agent.lastName}`.toLowerCase().includes(search)
    ).slice(0, 10) // Limit to 10 results
  })
  
  // Actions
  const setSearchTerm = (term: string) => {
    searchTerm.value = term
    isSearchOpen.value = term.length > 0
  }
  
  const selectAgent = (agentId: string) => {
    // Agent selection logic
    
    selectedAgentIds.value = [agentId]
    searchTerm.value = ''
    isSearchOpen.value = false
    
    // Navigate to appointments with pre-selected agent
    router.push({
      path: '/appointments',
      query: { agents: agentId }
    })
  }
  
  const clearSearch = () => {
    searchTerm.value = ''
    isSearchOpen.value = false
  }
  
  const initializeAgents = async () => {
    try {
      await fetchAgents()
    } catch (error) {
      // Error handled silently
    }
  }
  
  return {
    // State
    searchTerm,
    isSearchOpen,
    selectedAgentIds,
    
    // Computed
    filteredAgents,
    
    // Actions
    setSearchTerm,
    selectAgent,
    clearSearch,
    initializeAgents
  }
})
