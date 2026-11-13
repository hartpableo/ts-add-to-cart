import {defineConfig} from "vite";

export default defineConfig({
  base: "/ts-add-to-cart/",
  server: {
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
});
