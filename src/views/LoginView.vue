<script setup lang="ts">
import LoginForm from '../components/LoginForm.vue'
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background decorative elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-10 -left-10 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 -right-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-20 left-1/3 w-64 h-64 bg-indigo-200/25 rounded-full blur-3xl"></div>
    </div>
    
    <!-- Main content container -->
    <div class="relative z-10 w-full max-w-md">
      <!-- Header section with branding -->
      <div class="text-center mb-8">
        <div class="mx-auto mb-6">
          <div class="w-24 h-24 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl mx-auto flex items-center justify-center shadow-2xl transform -rotate-3 hover:rotate-3 transition-transform duration-500">
            <div class="w-12 h-12 bg-white/20 rounded-2xl"></div>
          </div>
        </div>
        
        <h1 class="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          TaskFlow Pro
        </h1>
        <p class="text-slate-600 text-lg font-medium">
          Professional Task Management Platform
        </p>
      </div>
      
      <!-- Login form container with glassmorphism effect -->
      <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-500">
        <LoginForm />
      </div>
      
      <!-- Footer section -->
      
    </div>
  </div>
</template>