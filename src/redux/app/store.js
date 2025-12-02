import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { setupListeners } from '@reduxjs/toolkit/query';
import { simManagementDataSlice } from '../features/manage-sim/simManagementDataSlice';
import { overViewSlice } from '../features/manage-tsat/overviewSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { simPreActivationSlice } from "../features/simPreActivationSlice";

const rootReducer = combineSlices(simManagementDataSlice, overViewSlice, simPreActivationSlice);

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = (preloadedState) => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }),
    preloadedState,
  });
  setupListeners(store.dispatch);
  return store;
};

export const store = makeStore();
export const persistor = persistStore(store);

