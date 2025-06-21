import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // Production optimizations
  build: {
    // Output directory
    outDir: "dist",

    // Generate sourcemaps for debugging in production
    sourcemap: true,

    // Optimize bundle splitting
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunks
          "react-vendor": ["react", "react-dom"],
          "router-vendor": ["react-router-dom"],
          "ui-vendor": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-tabs",
          ],
          "query-vendor": ["@tanstack/react-query"],
          "supabase-vendor": ["@supabase/supabase-js"],

          // Feature-based chunks
          auth: [
            "./src/contexts/AuthContext.tsx",
            "./src/pages/Login.tsx",
            "./src/pages/Signup.tsx",
          ],
          admin: ["./src/pages/Admin.tsx"],
          messaging: [
            "./src/pages/Messages.tsx",
            "./src/lib/messageService.ts",
          ],
        },
      },
    },

    // Target modern browsers for smaller bundles
    target: "es2020",

    // Minification
    minify: "terser",
    terserOptions: {
      compress: {
        // Remove console logs in production
        drop_console: true,
        drop_debugger: true,
      },
    },

    // Asset optimization
    assetsDir: "assets",
    assetsInlineLimit: 4096, // 4kb

    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },

  // Development server configuration
  server: {
    port: 5173,
    host: true, // Allow external connections
    open: true, // Auto-open browser
  },

  // Preview server configuration (for production preview)
  preview: {
    port: 4173,
    host: true,
  },

  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },

  // CSS configuration
  css: {
    // Enable CSS modules if needed
    modules: {
      localsConvention: "camelCase",
    },
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@supabase/supabase-js",
      "@tanstack/react-query",
    ],
  },

  // Environment variable configuration
  envPrefix: "VITE_",

  // Progressive Web App configuration
  // Note: You might want to add @vite/plugin-pwa for full PWA support

  // Performance configuration
  esbuild: {
    // Remove debugger statements in production
    drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
  },
});
