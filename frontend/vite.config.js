import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 🔴 මේක අලුතින් import කරන්න

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 🔴 මේක ප්ලගින්ස් වලට එකතු කරන්න
  ],
})