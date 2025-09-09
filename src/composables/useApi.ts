import type { LoginRequest, LoginResponse, Task } from '@/types'

// Import mock data
import loginData from '@/mock-api/login.json'
import tasksData from '@/mock-api/tasks.json'

// Simple delay function to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const useApi = () => {
  let authToken = ''

  const setAuthToken = (token: string) => {
    authToken = token
    if (token) {
      console.log('🔑 Auth token set')
    } else {
      console.log('🚫 Auth token cleared')
    }
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
    console.log('🚀 Mock Tasks Request')
    
    // Simulate network delay
    await delay(300)
    
    console.log('✅ Returning tasks:', tasksData.length, 'items')
    console.log('📋 Tasks data:', tasksData)
    
    return tasksData as Task[]
  }

  return {
    setAuthToken,
    login,
    fetchTasks
  }
}