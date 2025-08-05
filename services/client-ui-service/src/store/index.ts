import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import boothReducer from './booth-slice';

//import alertReducer, { setStoreReference } from './alert-slice';
//import { setStoreReference } from './alert-slice';

// Ensure React is loaded before Redux
import React from 'react';

// Verify React is available
if (!React || !React.useSyncExternalStore) {
  throw new Error('React useSyncExternalStore is not available. React may not be properly loaded.');
}

// Configure the store
export const store = configureStore({
  reducer: {
   // user: userReducer,
    booth: boothReducer, // Add this line
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Setup RTK Query listeners
setupListeners(store.dispatch);

// Set store reference for alert slice
// setStoreReference(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Create typed hooks for use throughout the app
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Export store as default
export default store;