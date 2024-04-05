import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const storeApi = createApi({
  reducerPath: "storeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:44317",
  }),    
  endpoints: (builder) => ({
    fetchStore: builder.query({
      query: ({ page, limit, keyword='' }) => `/PCShopApi?page=${page}&limit=${limit}&keyword=${keyword}`,
    }),
    updateRow: builder.mutation({
      query: (newRowData: any) => ({
        url: "/PCShopApi",
        method: "POST",
        body: { ...newRowData },
      }),
    }),
  }),
});

export const { useFetchStoreQuery, useUpdateRowMutation } = storeApi;
