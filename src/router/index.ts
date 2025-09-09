import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; 
import LoginView from '@/views/LoginView.vue';

import DashboardView from '@/views/DashboardView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/',
        redirect: '/login'
      },
      {
        path: '/login',
        name: 'login',
        component: LoginView
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        component: DashboardView,
        meta: { requiresAuth: true }
      }

    ]        
})

router.beforeEach((to) => {
    const authStore = useAuthStore();

    authStore.initAuth();

    if(to.meta.requiresAuth && !authStore.isAuthenticated) {
      return '/login';
    }

    if(to.path === '/login' && authStore.isAuthenticated) {
      return '/dashboard';
    }
})

export default router;