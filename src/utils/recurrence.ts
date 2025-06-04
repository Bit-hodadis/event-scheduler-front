import { Event } from '../types/event.types';
import { parseISO, isWithinInterval } from 'date-fns';

export function getRecurringEventInstances(event: Event, start: Date, end: Date): Event[] {
  if (!event.is_recurring || !event.recurrence_rule) {
    return [event];
  }

  // For now, just return the base event
  // TODO: Implement recurrence expansion based on recurrence_rule
  return [event];
}
