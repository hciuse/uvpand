// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: '/uvpand/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        experiment: resolve(__dirname, "experiment/index.html"),
      },
    },
  },
});
