import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import App from './App'
import './index.css'
import { Providers } from "./store/provider";
import ScrollToTop from './components/common/ScrollToTo'
// import { disableReactDevTools } from '@fvilers/disable-react-devtools';

// Ensure React is properly loaded and has useSyncExternalStore
if (!React || !React.useSyncExternalStore) {
  throw new Error('React useSyncExternalStore is not available. React may not be properly loaded.');
}

// Ensure React is available globally for Redux
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

// Option 1: Create a type declaration file
// Create a new file: src/types/global.d.ts

interface ReactDevTools {
  inject: (renderer: any) => void;
  isDisabled?: boolean;
  [key: string]: any;
}

declare global {
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: ReactDevTools;
  }
}

export {};
// Production optimizations
if (import.meta.env.PROD || import.meta.env.VITE_ENVIRONMENT === 'prod') {
  // Disable React DevTools (safe approach)
  try {
    const devToolsHook = '__REACT_DEVTOOLS_GLOBAL_HOOK__';
    const hook = (window as any)[devToolsHook];
    
    if (hook && typeof hook === 'object') {
      // Only modify if the hook exists and is an object
      if (hook.inject) {
        hook.inject = () => {};
      }
      hook.isDisabled = true;
    }
  } catch (error) {
    // Silently fail - DevTools blocking is not critical
  }
  
  // Remove console methods in production
  if (!import.meta.env.VITE_ENABLE_CONSOLE) {
    console.log = () => {};
    console.info = () => {};
    console.debug = () => {};
    console.warn = () => {};
  }
}
if (import.meta.env.PROD || import.meta.env.VITE_ENVIRONMENT === 'prod') {
  for(const method of ['log', 'error', 'warn', 'info', 'debug', 'trace', 'table', 'group', 'groupEnd', 'time', 'timeEnd', 'timeLog']){
    // @ts-ignore
    console[method] = () => {};
  }
}
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router basename="/">
     <Providers>
      <UserProvider>
        <ScrollToTop />
        <App />
      </UserProvider>
     </Providers>
      
    </Router>
  </React.StrictMode>,
) 