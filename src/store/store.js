import { configureStore } from "@reduxjs/toolkit";
import { articlesApi, authApi } from "../api/api";
import authReducer from "../reducer/reducer";

const store = configureStore({
  reducer: {
    [articlesApi.reducerPath]: articlesApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(articlesApi.middleware)
      .concat(authApi.middleware),
});

export default store;
