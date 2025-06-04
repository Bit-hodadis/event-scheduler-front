import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../services/auth.service';
import { eventApi } from '../services/event.service';
import { categoryApi } from '../services/category.service';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [eventApi.reducerPath]: eventApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, eventApi.middleware, categoryApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
