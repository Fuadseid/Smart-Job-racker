"use client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authenticationEndpoints } from "./endPoints/authenticationEndpoints";
import { RootState } from "./store";
import { contactEndpoints } from "./endPoints/contactEndpoints";
export const apiSlice = createApi({
  reducerPath: "user",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/",
    //baseUrl: "https://backend.maid-match.com/api/",
    credentials: "omit",
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      headers.set("X-Tenant", state.auth.tenant);
      headers.set("Accept-Language", state.auth.lang);
      const token = state.auth.token;

      if (state.auth.isAuthenticated) {
        headers.set("Authorization", `Bearer ${token}`);
        return headers;
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    ...authenticationEndpoints(builder),
    ...contactEndpoints(builder)
  }),
});

export const {
  useGetCsrfTokenQuery,
  useCreateConrtactMutation
} = apiSlice;
