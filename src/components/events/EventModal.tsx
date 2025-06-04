import React from 'react';
import { Event, CreateEventDto } from '../../types/event.types';
import { EventForm } from './EventForm';
import Modal from '../common/Modal';
import { useGetCategoriesQuery } from '../../services/category.service';
import { useToast } from '../../context/ToastContext';
interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEventDto) => Promise<void>;
  event?: Event;
  isLoading?: boolean;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  event,
  isLoading,
}) => {
  const { data: categories = [] } = useGetCategoriesQuery();
const toast = useToast()
  const handleSubmit = async (data: CreateEventDto) => {
    try {
      await onSubmit({
        ...data,
        timezone: 'UTC',
        is_recurring: data.recurrence_rule !== undefined,
      });
      toast.success('Event created or Updated successfully');
      onClose();
    } catch (error) {
      console.error('Error submitting event:', error);
      toast.error(error?.data?.detail||error?.data?.name||'Failed to create event');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event ? 'Edit Event' : 'Create New Event'}
      size="60"
    >
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <EventForm
          initialData={event}
          onSubmit={handleSubmit}
          categories={categories}
          isLoading={isLoading}
        />
      </div>
    </Modal>
  );
};
