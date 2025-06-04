import {
  addDays,
  addWeeks,
  addMonths,
  addYears,
  isBefore,
  isSameDay,
  startOfMonth,
  setDay,
  getDay,
  endOfMonth,
} from 'date-fns';
import type { Event, RecurrencePattern } from '../types/event.types';

export function getRecurringEventInstances(event: Event, startRange: Date, endRange: Date): Event[] {
  if (!event.recurrence) {
    return [event];
  }

  const instances: Event[] = [];
  const recurrence = event.recurrence;
  const eventStart = new Date(event.startDate);
  const eventEnd = new Date(event.endDate);
  const duration = eventEnd.getTime() - eventStart.getTime();

  let currentDate = new Date(eventStart);

  while (isBefore(currentDate, endRange)) {
    if (recurrence.endDate && isBefore(new Date(recurrence.endDate), currentDate)) {
      break;
    }

    if (!isBefore(currentDate, startRange)) {
      instances.push({
        ...event,
        id: `${event.id}_${currentDate.toISOString()}`,
        startDate: currentDate.toISOString(),
        endDate: new Date(currentDate.getTime() + duration).toISOString(),
        isRecurringInstance: true,
      });
    }

    currentDate = getNextOccurrence(currentDate, recurrence);
  }

  return instances;
}

function getNextOccurrence(date: Date, recurrence: RecurrencePattern): Date {
  switch (recurrence.type) {
    case 'daily':
      return addDays(date, recurrence.interval || 1);

    case 'weekly': {
      if (!recurrence.weekDays?.length) {
        return addWeeks(date, recurrence.interval || 1);
      }

      let nextDate = addDays(date, 1);
      const maxIterations = 7; // Maximum days to check
      let iterations = 0;
      
      while (iterations < maxIterations) {
        const dayName = getDayName(getDay(nextDate)).toLowerCase();
        if (recurrence.weekDays?.includes(dayName as WeekDay)) {
          return nextDate;
        }
        nextDate = addDays(nextDate, 1);
        iterations++;
      }
      
      return addWeeks(date, recurrence.interval || 1); // Fallback
    }

    case 'monthly': {
      if (recurrence.position && recurrence.weekDay) {
        return getNextMonthlyByWeekDay(date, recurrence);
      }
      return addMonths(date, recurrence.interval || 1);
    }

    case 'yearly':
      return addYears(date, recurrence.interval || 1);

    default:
      return addDays(date, 1);
  }
}

function getNextMonthlyByWeekDay(date: Date, recurrence: RecurrencePattern): Date {
  const nextMonth = addMonths(date, recurrence.interval || 1);
  const monthStart = startOfMonth(nextMonth);
  const monthEnd = endOfMonth(nextMonth);

  const weekDayNumber = recurrence.weekDay ? getDayNumber(recurrence.weekDay) : 0;
  let current = setDay(monthStart, weekDayNumber);
  
  if (getDay(current) > getDay(monthStart)) {
    current = addDays(current, -7);
  }

  switch (recurrence.position) {
    case 'first':
      return current;
    case 'second':
      return addWeeks(current, 1);
    case 'third':
      return addWeeks(current, 2);
    case 'fourth':
      return addWeeks(current, 3);
    case 'last': {
      while (isBefore(addWeeks(current, 1), monthEnd)) {
        current = addWeeks(current, 1);
      }
      return current;
    }
    default:
      return current;
  }
}

function getDayName(day: number): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[day];
}

function getDayNumber(day: string): number {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days.indexOf(day.toLowerCase());
}

export function isEventInRange(event: Event, start: Date, end: Date): boolean {
  const eventStart = new Date(event.startDate);
  const eventEnd = new Date(event.endDate);

  // Check if the event overlaps with the range
  return (
    (isBefore(eventStart, end) && isBefore(start, eventEnd)) ||
    isSameDay(eventStart, start) ||
    isSameDay(eventEnd, end)
  );
}
