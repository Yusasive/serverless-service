import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // Build configuration
  build: {
    outDir: 'dist',
    // Disable source maps in production
    sourcemap: false,
    
    // Use esbuild for safer minification (less likely to break React)
    minify: 'esbuild',
    
    // Rollup specific options
    rollupOptions: {
      output: {
        // Disable chunk splitting to prevent React timing issues
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
  server: {
    port: 3010,
    host: true,
    open: '/',
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
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react', 
      'react-dom'
    ],
    // Force pre-bundling of React
    force: true,
  },
  
  // Environment variables prefix
  envPrefix: 'VITE_',
})
