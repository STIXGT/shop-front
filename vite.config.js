import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    proxy: {
      // Configuración del proxy inverso
      "/api": {
        target: "http://98.89.22.41:8000", // Cambia esto por la URL de tu backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // Descomenta si tu backend no espera el prefijo /api
      },
    },
  },
});
