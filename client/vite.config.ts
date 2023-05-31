import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, './', '')

  return {
    plugins: [react()],
    define: {
      __APP_ENV__: env.APP_ENV,
      "import.meta.env.SERVER_URL": `"${env.SERVER_URL}"`,
    },
  }
})
