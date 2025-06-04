import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Event, CreateEventDto, UpdateEventDto } from '../types/event.types';

export const eventApi = createApi({
  reducerPath: 'eventApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api',
credentials: 'include',
  }),
  tagTypes: ['Event'],
  endpoints: (builder) => ({
    getEvents: builder.query<Event[], void>({
      query: () => '/events/',
      providesTags: ['Event'],
    }),
    getEvent: builder.query<Event, string>({
      query: (id) => `/events/${id}`,
      providesTags: ['Event'],
    }),
    createEvent: builder.mutation<Event, CreateEventDto>({
      query: (event) => ({
        url: '/events/',
        method: 'POST',
        body: event,
      }),
      invalidatesTags: ['Event'],
    }),
    updateEvent: builder.mutation<Event, { id: string; event: UpdateEventDto }>({
      query: ({ id, event }) => ({
        url: `/events/${id}/`,
        method: 'PUT',
        body: event,
      }),
      invalidatesTags: ['Event'],
    }),
    deleteEvent: builder.mutation<void, string>({
      query: (id) => ({
        url: `/events/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Event'],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventApi;
