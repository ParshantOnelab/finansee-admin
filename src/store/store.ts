import { configureStore } from '@reduxjs/toolkit'
import { api } from './api'
import { usersReducer,roleReducer,tokenReducer } from './reducers'

export const store = configureStore({
  reducer: {
    [api.reducerPath]:api.reducer,
    [usersReducer.name]: usersReducer.reducer,
    [roleReducer.name]: roleReducer.reducer,
    [tokenReducer.name]: tokenReducer.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch