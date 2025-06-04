import React, { useState, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  parseISO,
  isWithinInterval,
  startOfDay,
} from 'date-fns';
import { useGetEventsQuery } from '../../services/event.service';
import { getRecurringEventInstances } from '../../utils/recurrence';
import type { Event } from '../../types/event.types';

interface CalendarProps {
  onEventClick?: (event: Event) => void;
  onAddEvent?: () => void;
}

export const Calendar: React.FC<CalendarProps> = ({ onEventClick, onAddEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { data: events = [], isLoading } = useGetEventsQuery();

  // Calculate events for the current month view, including recurring events
  const eventsInView = useMemo(() => {
    if (!events || events.length === 0) return [];
    
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    
    return events.flatMap(event => {
      if (!event.start_time || !event.end_time) return [];
      return getRecurringEventInstances(event, monthStart, monthEnd);
    }).filter(event => {
      if (!event.start_time) return false;
      try {
        const startDate = parseISO(event.start_time);
        return isWithinInterval(startDate, {
          start: monthStart,
          end: monthEnd,
        });
      } catch (error) {
        console.error('Error parsing event date:', error);
        return false;
      }
    });
  }, [events, currentDate]);

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  // Group events by day
  const eventsByDay = useMemo(() => {
    const grouped = new Map<string, Event[]>();
    if (!eventsInView) return grouped;
    
    days.forEach(day => {
      const dayEvents = eventsInView.filter(event => {
        if (!event.start_time || !event.end_time) return false;
        try {
          return isWithinInterval(startOfDay(day), {
            start: parseISO(event.start_time),
            end: parseISO(event.end_time),
          });
        } catch (error) {
          console.error('Error parsing event date:', error);
          return false;
        }
      });
      
      if (dayEvents?.length > 0) {
        grouped.set(format(day, 'yyyy-MM-dd'), dayEvents);
      }
    });
    
    return grouped;
  }, [days, eventsInView]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Calendar header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button
            onClick={onAddEvent}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            + Event
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div
            key={day}
            className="p-2 text-center text-sm font-semibold text-gray-700"
          >
            {day}
          </div>
        ))}

        {days.map(day => (
          <div
            key={day.toISOString()}
            className={`min-h-[100px] p-2 border border-gray-200
              ${!isSameMonth(day, currentDate) ? 'bg-gray-50' : 'bg-white'}
              ${isToday(day) ? 'bg-blue-50' : ''}
            `}
          >
            <div className={`text-sm font-medium mb-1 ${isToday(day) ? 'text-blue-600' : !isSameMonth(day, currentDate) ? 'text-gray-400' : 'text-gray-900'}`}>
              {format(day, 'd')}
            </div>
            <div className="space-y-1 overflow-y-auto max-h-[80px]">
              {eventsByDay.get(format(day, 'yyyy-MM-dd'))?.map((event) => (
                <button
                  key={event.id}
                  onClick={() => onEventClick?.(event)}
                  className="w-full text-left text-xs p-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 truncate"
                  title={event.title}
                >
                  {format(parseISO(event.start_time), 'HH:mm')} - {event.title}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
