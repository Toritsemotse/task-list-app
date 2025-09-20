import { ref, watch, onMounted } from 'vue'

export const useDarkMode = () => {
  const isDark = ref(false)

  // Initialize dark mode from localStorage or system preference
  const initDarkMode = () => {
    const stored = localStorage.getItem('darkMode')
    if (stored) {
      isDark.value = JSON.parse(stored)
    } else {
      // Use system preference as fallback
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    
    updateDarkModeClass()
  }

  // Update the HTML class and localStorage
  const updateDarkModeClass = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(isDark.value))
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    isDark.value = !isDark.value
  }

  // Watch for changes and update class
  watch(isDark, updateDarkModeClass)

  // Initialize on mount
  onMounted(initDarkMode)

  return {
    isDark,
    toggleDarkMode
  }
}