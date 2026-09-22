import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuração padrão do Vite para uma SPA em React.
// Nenhuma configuração especial é necessária: o Firebase roda inteiramente
// no cliente através do SDK modular importado em src/firebase/config.js.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
