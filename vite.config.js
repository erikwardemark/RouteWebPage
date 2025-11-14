import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// vite config for handling .vue files and configuring vitest
export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/__test__/**/*.spec.{js,ts}'],
    // Disable worker threads/forks runner which can timeout on some Windows/OneDrive setups
    // Running tests in the main thread is slightly slower but more reliable in problematic environments
    threads: false,
  },
})
