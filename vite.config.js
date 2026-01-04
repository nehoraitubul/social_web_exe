import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    allowedHosts: [
      "7ab7c992be55.ngrok-free.app",
      ".ngrok-free.app"
    ]
  }

})
