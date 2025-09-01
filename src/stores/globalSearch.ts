import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAgents } from '@/composables/agent/useAgents.ts'
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
    // Show all agents when search is open but no search term
    if (!searchTerm.value.trim()) {
      return isSearchOpen.value ? agents.value.slice(0, 10) : []
    }
    
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
    // Keep dropdown open when typing or when focused (even if empty)
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
      console.error(error)
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
