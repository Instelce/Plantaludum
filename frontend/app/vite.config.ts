import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  // const env = loadEnv(mode, process.cwd(), '')
  return {
    // vite config
    plugins: [react()],
    // server: {
    //   port: 8080,
    //   strictPort: true,
    //   host: true,
    //   origin: "http://0.0.0.0:8080",
    //  },
  }
})