import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { Task } from '@/types';
import { useApi } from '@/composables/useApi';

export const useTasksStore = defineStore('tasks', () => {
    const tasks = ref<Task[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const statusFilter = ref<'all' | 'in_progress' | 'completed'>('all')
    const searchQuery = ref('')

    const { fetchTasks: apiFetchTasks } = useApi()

    // Computed property for filtered and searched tasks
    const filteredTasks = computed(() => {
        let filtered = tasks.value

        // Filter by status first
        if (statusFilter.value !== 'all') {
            filtered = filtered.filter(task => task.status === statusFilter.value)
        }

        // Then filter by search query
        if (searchQuery.value && searchQuery.value.trim()) {
            const query = searchQuery.value.toLowerCase()
            filtered = filtered.filter(task => 
                task.title.toLowerCase().includes(query) ||
                task.assignee.toLowerCase().includes(query) ||
                task.details.toLowerCase().includes(query)
            )
        }

        return filtered
    })

    // Computed property for task counts
    const taskCounts = computed(() => ({
        total: tasks.value.length,
        in_progress: tasks.value.filter(task => task.status === 'in_progress').length,
        completed: tasks.value.filter(task => task.status === 'completed').length
    }))

    const fetchTasks = async () => {
        console.log('Fetching tasks...')
        isLoading.value = true
        error.value = null

        try {
            const data = await apiFetchTasks()
            console.log('Tasks fetched:', data)
            tasks.value = Array.isArray(data) ? data : []
        } catch (err) {
            error.value = 'Failed to fetch tasks'
            console.error('Error fetching tasks:', err)
        } finally {
            isLoading.value = false
            console.log('Loading finished, tasks count:', tasks.value.length)
        }
    }

    const setStatusFilter = (filter: 'all' | 'in_progress' | 'completed') => {
        statusFilter.value = filter
        console.log('Status filter set to:', filter)
    }

    const setSearchQuery = (query: string) => {
        searchQuery.value = query || ''
        console.log('Search query set to:', query)
    }

    const clearFilters = () => {
        statusFilter.value = 'all'
        searchQuery.value = ''
        console.log('All filters cleared')
    }

    return {
        tasks,
        isLoading,
        error,
        statusFilter,
        searchQuery,
        filteredTasks,
        taskCounts,
        fetchTasks,
        setStatusFilter,
        setSearchQuery,
        clearFilters
    }
});