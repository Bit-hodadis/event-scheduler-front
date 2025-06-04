import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { LoginFormData, SignupFormData } from '../schemas/auth.schema';

interface AuthResponse {
  email: string;
  first_name: string;
  last_name: string;
  id: string;
  session: string;
}

interface ApiError {
  status: number;
  data: {
    message: string;
  };
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:8000/api',
    credentials: 'include',
    // prepareHeaders: (headers) => {
    //   const token = localStorage.getItem('token');
    //   if (token) {
    //     headers.set('authorization', `Bearer ${token}`);
    //   }
    //   return headers;
    // },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginFormData>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: AuthResponse) => {
        localStorage.setItem('session', response.session);
        localStorage.setItem('user', JSON.stringify(response));
        return response;
      },
      transformErrorResponse: (response: ApiError) => response,
    }),
    signup: builder.mutation<AuthResponse, SignupFormData>({
      query: (userData) => ({
        url: '/auth/signup',
        method: 'POST',
        body: userData,
      }),
      transformResponse: (response: AuthResponse) => {
        localStorage.setItem('session', response.session);
        localStorage.setItem('user', JSON.stringify(response));
        return response;
      },
      transformErrorResponse: (response: ApiError) => response,
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          localStorage.removeItem('session');
          localStorage.removeItem('user');
        } catch {
          // Handle error if needed
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
} = authApi;
