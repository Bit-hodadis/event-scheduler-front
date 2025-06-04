import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useGetEventsQuery, useCreateEventMutation, useUpdateEventMutation, useDeleteEventMutation } from '../services/event.service';
import { EventModal } from '../components/events/EventModal';
import type { Event, CreateEventDto } from '../types/event.types';

export const ListView: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();

  const { data: events = [], isLoading } = useGetEventsQuery();
  const [createEvent] = useCreateEventMutation();
  const [updateEvent] = useUpdateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleEventSubmit = async (event: CreateEventDto): Promise<void> => {
    if (selectedEvent) {
      await updateEvent({ id: selectedEvent.id, event }).unwrap();
    } else {
      await createEvent(event).unwrap();
    }
    setIsModalOpen(false);
  };

  const handleDeleteEvent = async (eventId: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(eventId);
    }
  };

  const handleAddEvent = () => {
    setSelectedEvent(undefined);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className=" mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Upcoming Events</h1>
        <button
          onClick={handleAddEvent}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
        >
          + Event
        </button>
      </div>

      {/* Event list */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {events.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No events found. Click the + Event button to create one.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {events?.map((event) => (
              <div
                key={event.id}
                className="p-4 hover:bg-gray-50 flex items-start justify-between group"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                    {event?.recurrence && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Recurring
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {event?.isAllDay ? (
                      format(parseISO(event.startDate), 'MMMM d, yyyy')
                    ) : (
                      <>
                        {format(parseISO(event?.start_time), 'MMMM d, yyyy h:mm a')} -{' '}
                        {format(parseISO(event?.end_time), 'h:mm a')}
                      </>
                    )}
                  </div>
                  {event.description && (
                    <p className="mt-1 text-sm text-gray-600">{event.description}</p>
                  )}
                </div>
                <div className="ml-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEventClick(event)}
                    className="text-gray-400 hover:text-gray-600"
                    title="Edit"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="text-gray-400 hover:text-red-600"
                    title="Delete"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          event={selectedEvent}
          onSubmit={handleEventSubmit}
        />
      )}
    </div>
  );
};
