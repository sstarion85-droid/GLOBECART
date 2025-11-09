import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  clearScreen: false, // prevent Vite from clearing console on each refresh
  server: {
    hmr: {
      overlay: true, // show errors in browser overlay
    },
  },
  // 👇 This silences most HMR "update/invalidate" logs
  logLevel: "error",
});
