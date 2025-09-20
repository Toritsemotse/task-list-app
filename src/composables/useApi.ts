import type { LoginRequest, LoginResponse, Task } from '@/types'

// Import mock data
import loginData from '@/mock-api/login.json'
import tasksData from '@/mock-api/tasks.json'

// Simple delay function to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Create a mutable copy of tasks data for CRUD operations
let mockTasks: Task[] = [...tasksData as Task[]]

// SHARED auth token - this is the key fix!
let sharedAuthToken = ''

export const useApi = () => {
  const setAuthToken = (token: string) => {
    sharedAuthToken = token
    if (token) {
      console.log('🔑 Auth token set:', token.substring(0, 10) + '...')
    } else {
      console.log('🚫 Auth token cleared')
    }
  }

  // Check if user is authenticated
  const requireAuth = () => {
    if (!sharedAuthToken) {
      console.error('❌ Authentication required - no token found')
      throw new Error('Authentication required')
    }
    console.log('✅ Authentication check passed')
  }

  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    console.log('🚀 Mock Login Request:', credentials.email)
    
    // Simulate network delay
    await delay(500)
    
    const userData = loginData[credentials.email as keyof typeof loginData]
    
    if (userData && userData.password === credentials.password) {
      console.log('✅ Login successful')
      return {
        token: userData.token,
        user: userData.user
      }
    } else {
      console.log('❌ Login failed')
      throw new Error('Invalid credentials')
    }
  }

  const fetchTasks = async (): Promise<Task[]> => {
    requireAuth()
    console.log('🚀 Mock Tasks Request')
    
    // Simulate network delay
    await delay(300)
    
    console.log('✅ Returning tasks:', mockTasks.length, 'items')
    console.log('📋 Tasks data:', mockTasks)
    
    return [...mockTasks] // Return a copy
  }

  const updateTaskStatus = async (taskId: string, newStatus: 'in_progress' | 'completed'): Promise<Task> => {
    requireAuth()
    console.log('🔄 Mock Update Task Status:', taskId, 'to', newStatus)
    
    // Simulate network delay
    await delay(400)
    
    const taskIndex = mockTasks.findIndex(task => task.id === taskId)
    if (taskIndex === -1) {
      throw new Error('Task not found')
    }
    
    // Update the task status
    mockTasks[taskIndex] = {
      ...mockTasks[taskIndex],
      status: newStatus
    }
    
    console.log('✅ Task status updated successfully')
    return mockTasks[taskIndex]
  }

  const deleteTask = async (taskId: string): Promise<void> => {
    requireAuth()
    console.log('🗑️ Mock Delete Task:', taskId)
    
    // Simulate network delay
    await delay(500)
    
    const taskIndex = mockTasks.findIndex(task => task.id === taskId)
    if (taskIndex === -1) {
      throw new Error('Task not found')
    }
    
    // Remove the task
    mockTasks.splice(taskIndex, 1)
    
    console.log('✅ Task deleted successfully')
  }

  const updateTask = async (taskId: string, updates: Partial<Task>): Promise<Task> => {
    requireAuth()
    console.log('📝 Mock Update Task:', taskId, updates)
    
    // Simulate network delay
    await delay(400)
    
    const taskIndex = mockTasks.findIndex(task => task.id === taskId)
    if (taskIndex === -1) {
      throw new Error('Task not found')
    }
    
    // Update the task
    mockTasks[taskIndex] = {
      ...mockTasks[taskIndex],
      ...updates
    }
    
    console.log('✅ Task updated successfully')
    return mockTasks[taskIndex]
  }

  const createTask = async (taskData: Omit<Task, 'id'>): Promise<Task> => {
    requireAuth()
    console.log('➕ Mock Create Task:', taskData)
    
    // Simulate network delay
    await delay(400)
    
    // Generate a simple ID
    const newId = 't' + (mockTasks.length + 1)
    
    const newTask: Task = {
      id: newId,
      ...taskData
    }
    
    mockTasks.push(newTask)
    
    console.log('✅ Task created successfully')
    return newTask
  }

  return {
    setAuthToken,
    login,
    fetchTasks,
    updateTaskStatus,
    deleteTask,
    updateTask,
    createTask
  }
}