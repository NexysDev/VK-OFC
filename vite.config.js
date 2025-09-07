import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: process.env.PORT || 5000,
    allowedHosts: [
      "c13d65cd-c7fa-49bd-89be-5b7aac10c14c-00-222bcwendvkk8.picard.replit.dev"
    ]
  }
});