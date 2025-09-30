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
      class="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors max-sm:p-4"
    >
      <div class="flex items-center justify-between max-sm:items-start">
        <div class="flex-1 grid grid-cols-4 gap-6 max-sm:block max-sm:space-y-3">
          
          <!-- Title - Full width on mobile -->
          <div class="flex items-center space-x-3 max-sm:space-x-2">
            <div class="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
            <h3 class="font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors max-sm:text-sm max-sm:line-clamp-2">
              {{ task.title }}
            </h3>
          </div>
          
          <!-- Status -->
          <div class="flex items-center space-x-2 max-sm:justify-between max-sm:bg-gray-50 max-sm:dark:bg-gray-700 max-sm:p-2 max-sm:rounded">
            <span 
              class="px-3 py-1 rounded-full text-xs font-semibold max-sm:px-2"
              :class="getStatusColor(task.status)"
            >
              {{ task.status.replace('_', ' ').toUpperCase() }}
            </span>
            <span v-if="task.status === 'completed'" class="text-green-500 text-sm max-sm:text-xs">✓</span>
          </div>
          
          <!-- Assignee -->
          <div class="flex items-center space-x-3 max-sm:justify-between max-sm:bg-gray-50 max-sm:dark:bg-gray-700 max-sm:p-2 max-sm:rounded">
            <span class="text-slate-700 dark:text-slate-300 font-medium max-sm:text-sm max-sm:truncate max-sm:flex-1 max-sm:mr-2">Assignee:</span>
            <span class="text-slate-700 dark:text-slate-300 font-medium max-sm:text-sm max-sm:truncate">{{ task.assignee }}</span>
          </div>
          
          <!-- Due Date -->
          <div class="flex items-center space-x-2 max-sm:justify-between max-sm:bg-gray-50 max-sm:dark:bg-gray-700 max-sm:p-2 max-sm:rounded">
            <span class="text-slate-700 dark:text-slate-300 font-medium max-sm:text-sm max-sm:truncate max-sm:flex-1 max-sm:mr-2">Due:</span>
            <span class="text-slate-700 dark:text-slate-300 font-medium max-sm:text-sm max-sm:truncate">{{ formatDate(task.due_date) }}</span>
          </div>
        </div>
        
        <!-- Expand/Collapse Button -->
        <div class="ml-4 max-sm:ml-2 max-sm:mt-1">
          <div 
            class="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors max-sm:w-7 max-sm:h-7"            
          >
            <span 
              class="text-gray-500 transition-transform duration-200 max-sm:text-xs"
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