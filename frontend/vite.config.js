import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// ✅ Configuración dinámica basada en el modo (development, production, etc.)
export default defineConfig(({ mode }) => {
  // Carga las variables de entorno del archivo .env correspondiente
  const env = loadEnv(mode, process.cwd());
  const API_URL = env.VITE_API_URL;

  return {
    base: "./",
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 5173, // 👈 opcional: especifica el puerto
      open: false, // 👈 opcional: abre el navegador automáticamente
      proxy: {
        "/api": {
          target: API_URL,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, ""),
        },
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          ".js": "jsx",
        },
      },
    },
    build: {
      sourcemap: mode === "development", // 👈 útil para depurar
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString();
            }
          },
        },
      },
    },
  };
});
