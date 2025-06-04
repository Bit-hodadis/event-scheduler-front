import React, { useState } from 'react';
import { Calendar } from '../components/events/Calendar';
import { EventModal } from '../components/events/EventModal';
import { useCreateEventMutation, useUpdateEventMutation, useDeleteEventMutation } from '../services/event.service';
import type { Event, CreateEventDto } from '../types/event.types';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

export const CalendarPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();

  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(eventId).unwrap();
      } catch (err) {
        console.error('Failed to delete event:', err);
        // TODO: Show error toast
      }
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleAddEvent = () => {
    setSelectedEvent(undefined);
    setIsModalOpen(true);
  };

  const handleEventSubmit = async (data: CreateEventDto) => {
    try {
      if (selectedEvent) {
        await updateEvent({ id: selectedEvent.id, event: data }).unwrap();
      } else {
        await createEvent(data).unwrap();
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save event:', error);
      // TODO: Show error toast
    }
  };

  return (
    <div className=" mx-auto p-4">
      <ErrorBoundary>
        <Calendar
          onEventClick={handleEventClick}
          onAddEvent={handleAddEvent}
          onDeleteEvent={handleDeleteEvent}
        />
      </ErrorBoundary>

      {isModalOpen && (
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          event={selectedEvent}
          onSubmit={handleEventSubmit}
          isLoading={isCreating || isUpdating}
        />
      )}
    </div>
  );
};
