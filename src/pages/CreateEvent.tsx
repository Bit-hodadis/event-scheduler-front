import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EventForm } from '../components/events/EventForm';
import { useCreateEventMutation } from '../services/event.service';
import type { CreateEventDto } from '../types/event.types';

export const CreateEvent = () => {
  const navigate = useNavigate();
  const [createEvent, { isLoading }] = useCreateEventMutation();

  const handleSubmit = async (data: CreateEventDto) => {
    try {
      await createEvent(data).unwrap();
      navigate('/calendar'); // Redirect to calendar view after successful creation
    } catch (error) {
      console.error('Failed to create event:', error);
      // Handle error (you might want to show a toast notification)
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Event</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <EventForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};
