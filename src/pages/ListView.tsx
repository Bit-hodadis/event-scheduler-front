import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useGetEventsQuery, useCreateEventMutation, useUpdateEventMutation, useDeleteEventMutation } from '../services/event.service';
import { EventModal } from '../components/events/EventModal';
import type { Event, CreateEventDto } from '../types/event.types';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { EventDetailModal } from '../components/events/EventDetailModal';
import DeleteModal from '../components/common/DeleteModal';
import { useToast } from '../context/ToastContext';
export const ListView: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { data: events = [], isLoading } = useGetEventsQuery();
  const [createEvent] = useCreateEventMutation();
  const [updateEvent] = useUpdateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();
const toast = useToast()
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

  const handleDeleteEvent = async (isDelete: boolean): Promise<void> => {
    if (!isDelete) {
      setIsDeleteModalOpen(false)
      setSelectedEvent(undefined)
      return;}
    
      await deleteEvent(selectedEvent?.id).unwrap();
      setIsDeleteModalOpen(false)
      setSelectedEvent(undefined)
      toast.success('Event deleted successfully');
    
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
                <div className="ml-4 flex items-center space-x-2  transition-opacity">
                  <button
                    onClick={() => handleEventClick(event)}
                    className="text-gray-400 hover:text-gray-600"
                    title="Edit"
                  >
             <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() =>{ setSelectedEvent(event)
                      setIsDeleteModalOpen(true)}}
                    className="text-gray-400 hover:text-red-600"
                    title="Delete"
                  >
<TrashIcon className="h-5 w-5 text-red-600" />
                  </button>
                  <button
                    onClick={() =>{ setSelectedEvent(event);
                      setIsDetailModalOpen(true);
                    }}
                    className="text-gray-400 hover:text-red-600"
                    title="View"
                  >
<EyeIcon className="h-5 w-5 text-primary-600" />
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
      {isDetailModalOpen && (
        <EventDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          event={selectedEvent}
      
        />
      )}
      {  isDeleteModalOpen &&    <DeleteModal 
              showDeleteModal={isDeleteModalOpen}
              onDelete={handleDeleteEvent}
              title={selectedEvent?.title}
              topic="event"
              ></DeleteModal>}
    </div>
  );
};
