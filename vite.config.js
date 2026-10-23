import { defineConfig } from "vite"
import react, { reactCompilerPreset } from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import babel from "@rolldown/plugin-babel"
import { VitePWA } from "vite-plugin-pwa"
import { fileURLToPath } from "node:url"

const srcPath = fileURLToPath(new URL("./src", import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      "@": srcPath,
    },
  },

  plugins: [
    react(),

    babel({
      presets: [reactCompilerPreset()],
    }),

    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Doit ERP",
        short_name: "Doit",
        description: "Sistem manajemen produksi Doit",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
})