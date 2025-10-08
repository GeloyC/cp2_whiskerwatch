import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  base: "./", // <-- important for relative paths in Vercel
  root: ".", 
  publicDir: "public",
  build: {
    outDir: "dist",
    emptyOutDir: true // ensures old files don’t linger
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  }
});
