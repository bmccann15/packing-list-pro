import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: change this to your GitHub repo name if different.
// Example repo URL: https://github.com/bmccann15/packing-list-pro
// base should be: /packing-list-pro/
export default defineConfig({
  plugins: [react()],
  base: '/packing-list-pro/',
})
