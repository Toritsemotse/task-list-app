import{ ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type {User, LoginRequest } from '@/types';
import { useApi } from '@/composables/useApi';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const token = ref<string | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)              

    const isAuthenticated = computed(() => !!token.value)

    const { login: apiLogin, setAuthToken } = useApi()

    const login = async (credentials: LoginRequest) => {
        isLoading.value = true
        error.value = null
        try {
            const response = await apiLogin(credentials)
            token.value = response.token
            user.value = response.user

            localStorage.setItem('auth_token', response.token)
            localStorage.setItem('auth_user', JSON.stringify(response.user))

            console.log("about to set auth token")
            setAuthToken(response.token)
            console.log("auth token set")
        } catch (err) {
            error.value = 'Invalid email or password'
            throw err   

        }finally {
            isLoading.value = false
        }
    }

    const logout = () => {
        user.value = null
        token.value = null
        error.value = null
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        setAuthToken('')
        window.location.href = '/login'
    }

    const initAuth = () => {
        const savedToken = localStorage.getItem('auth_token')
        const savedUser = localStorage.getItem('auth_user')

        if (savedToken && savedUser) {
            token.value = savedToken
            user.value = JSON.parse(savedUser)
            setAuthToken(savedToken)
        }
    }

    return {
        user,
        token,
        isLoading, 
        error,

        isAuthenticated,
        login,
        logout,
        initAuth
    }
})