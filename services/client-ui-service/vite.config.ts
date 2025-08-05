// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
 import path from 'path'

// export default defineConfig({
//   base: '/',
//   plugins: [react()],
//   build: {
//     outDir: 'dist',
//     sourcemap: false,
//   },
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src')
//     }
//   },
//   server: {
//     allowedHosts: ['9c1d-2607-fea8-bde-2100-794b-32ef-bda1-9adb.ngrok-free.app'],
//     port: 3010,
//     host: true
//   }
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Build configuration
  build: {
    // Disable source maps in production
    sourcemap: false,
    
    // Use esbuild for safer minification (less likely to break React)
    minify: 'esbuild',
    
    // Rollup specific options
    rollupOptions: {
      output: {
        // Disable chunk splitting to prevent React/Redux timing issues
        manualChunks: undefined,
        
        // Use content hash for cache busting
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
    
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    
    // Enable CSS code splitting
    cssCodeSplit: true,
    
    // Asset handling
    assetsInlineLimit: 4096, // 4kb
  },
  
  // Server configuration (for development)
  server: {
    allowedHosts: ['9c1d-2607-fea8-bde-2100-794b-32ef-bda1-9adb.ngrok-free.app'],
    port: 3010,
    host: true, 
    strictPort: false,
    
    // Disable HMR overlay for errors
    hmr: {
      overlay: false,
    },
  },
  
  // Preview configuration (for testing production build)
  preview: {
    port: 4173,
    strictPort: false,
  },
  
  // Define global constants
  // define: {
  //   // Disable React DevTools in production
  //   '__REACT_DEVTOOLS_GLOBAL_HOOK__': JSON.stringify({
  //     isDisabled: true,
  //   }),
  // },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-redux', 
      '@reduxjs/toolkit',
      'redux'
    ],
    // Force pre-bundling of React and Redux
    force: true,
  },
  
  // Environment variables prefix
  envPrefix: 'VITE_',
});