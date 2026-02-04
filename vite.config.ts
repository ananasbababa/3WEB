import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      "/openlibrary":{
        target:"https://openlibrary.org",
        changeOrigin:true,
        rewrite: (path)=>path.replace(/^\/openlibrary/, "")
      }
    }
  }
})
