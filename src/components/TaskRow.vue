<script setup lang="ts">
import { ref } from 'vue'
import type { Task } from '../types'
import TaskDetails from './TaskDetails.vue'

interface Props {
  task: Task
}

defineProps<Props>()

// Local state for expand/collapse
const isExpanded = ref(false)

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

// Helper functions
const getStatusColor = (status: string) => {
  return status === 'completed' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-yellow-100 text-yellow-800'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short', 
    day: 'numeric'
  })
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">

    <!-- Main Task Row - Clickable -->

    <div 
      @click="toggleExpanded"
      class="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
    >
      <div class="flex items-center justify-between">
        <div class="flex-1 grid grid-cols-4 gap-6">

          <!-- Title -->
          <div class="flex items-center space-x-3">
            <div class="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
            <h3 class="font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {{ task.title }}
            </h3>
          </div>
          
          <!-- Status -->
          <div class="flex items-center space-x-2">
            <span 
              class="px-3 py-1 rounded-full text-xs font-semibold"
              :class="getStatusColor(task.status)"
            >
              {{ task.status.replace('_', ' ').toUpperCase() }}
            </span>
            <span v-if="task.status === 'completed'" class="text-green-500 text-sm">✓</span>
          </div>
          
          <!-- Assignee -->
          <div class="flex items-center space-x-3">
            <span class="text-slate-700 dark:text-slate-300 font-medium">{{ task.assignee }}</span>
          </div>
          
          <!-- Due Date -->
          <div class="flex items-center space-x-2">
            <span class="text-slate-700 dark:text-slate-300 font-medium">{{ formatDate(task.due_date) }}</span>
          </div>
        </div>
        
        <!-- Expand/Collapse Button -->
        <div class="ml-4">
          <div 
            class="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"            
          >
              <span 
                class="text-gray-500 transition-transform duration-200"
                :class="{ 'rotate-180': isExpanded }"
              >
                ⌄
              </span>
          </div>
        </div>
      </div>
    </div>

    <!-- TaskDetails Component for Expanded Section -->
    <TaskDetails v-if="isExpanded" :task="task" />
  </div>
</template>