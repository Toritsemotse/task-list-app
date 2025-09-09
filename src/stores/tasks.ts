import {ref } from 'vue';
import { defineStore } from 'pinia';
import type { Task } from '@/types';
import { useApi } from '@/composables/useApi';

export const useTasksStore = defineStore('tasks', () => {
    const tasks = ref<Task[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const { fetchTasks: apiFetchTasks } = useApi()

    const fetchTasks = async () => {
        console.log('Fetching tasks...')
        isLoading.value = true
        error.value = null

        try {
            const data = await apiFetchTasks()
            console.log('Tasks fetched:', data)
            tasks.value = data
        } catch (err) {
            error.value = 'Failed to fetch tasks'
            console.error('Error fetching tasks:', err)
        } finally {
            isLoading.value = false
            console.log('loading finished, tasks count:', tasks.value.length)
        }
    }

    return {
        tasks,
        isLoading,
        error,
        fetchTasks
    }
});