import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
dotenv.config()
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
proxy:{
  'process.env.REACT_APP_BACKEND_URL':JSON.stringify(process.env.REACT_APP_BACKEND_URL)
}
  },
  define:{
    'process.env.REACT_APP_BACKEND_URL':JSON.stringify(process.env.REACT_APP_BACKEND_URL)
  }
})
