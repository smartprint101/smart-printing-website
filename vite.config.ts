import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
// The SSR pass in scripts/build.mjs renders a single entry; the client pass
// also emits the admin panel as a second HTML entry.
const isSsrBuild = process.env.BUILD_TARGET === "ssr";

/** Serve the admin panel at /admin/ during `npm run dev` (built output uses dist/admin/). */
function adminRoute(): Plugin {
  return {
    name: "admin-route",
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        if (request.url === "/admin" || request.url === "/admin/") {
          request.url = "/admin.html";
        }
        next();
      });
    },
  };
}

export default defineConfig(({ isPreview }) => ({
  // Preview the static export without a misleading homepage fallback for unknown URLs.
  appType: isPreview ? "mpa" : "spa",
  plugins: [react(), tailwindcss(), adminRoute()],
  build: isSsrBuild
    ? {}
    : {
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, "index.html"),
            admin: path.resolve(__dirname, "admin.html"),
          },
        },
      },
  server: { allowedHosts: [".e2b.app"] },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@seed": path.resolve(__dirname, "data/seed"),
    },
  },
}));
