import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '../types/category.types';

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api',
    credentials: 'include',
    

  }),
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => '/calendars',
      providesTags: ['Category'],
    }),
    getCategory: builder.query<Category, string>({
      query: (id) => `/calendars/${id}`,
      providesTags: ['Category'],
    }),
    createCategory: builder.mutation<Category, CreateCategoryDto>({
      query: (data) => ({
        url: '/calendars/',
        method: 'POST',
        body: data,
      }),
    //   invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation<Category, { id: string; data: UpdateCategoryDto }>({
      query: ({ id, data }) => ({
        url: `/calendars/${id}/`,
        method: 'PUT',
        body: data,
      }),
    //   invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/calendars/${id}/`,
        method: 'DELETE',
      }),
    //   invalidatesTags: ['Category'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
