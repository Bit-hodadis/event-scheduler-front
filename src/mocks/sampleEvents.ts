import type { Event } from '../types/event.types';

const currentDate = new Date();
const tomorrow = new Date(currentDate);
tomorrow.setDate(currentDate.getDate() + 1);

const nextWeek = new Date(currentDate);
nextWeek.setDate(currentDate.getDate() + 7);

const nextMonth = new Date(currentDate);
nextMonth.setMonth(currentDate.getMonth() + 1);

export const mockEvents: Event[] = [
  // One-time events
  {
    id: '1',
    title: 'Team Meeting',
    description: 'Weekly team sync-up',
    startDate: currentDate.toISOString(),
    endDate: new Date(currentDate.getTime() + 60 * 60 * 1000).toISOString(), // 1 hour duration
    createdAt: currentDate.toISOString(),
    updatedAt: currentDate.toISOString(),
    createdBy: 'user123',
    category: 'Work',
  },
  {
    id: '2',
    title: 'Lunch with Client',
    description: 'Business lunch at Italian restaurant',
    startDate: tomorrow.toISOString(),
    endDate: new Date(tomorrow.getTime() + 90 * 60 * 1000).toISOString(), // 1.5 hours
    createdAt: currentDate.toISOString(),
    updatedAt: currentDate.toISOString(),
    createdBy: 'user123',
    category: 'Business',
  },
  
  // Daily recurring events
  {
    id: '3',
    title: 'Daily Standup',
    description: 'Daily team standup meeting',
    startDate: currentDate.toISOString(),
    endDate: new Date(currentDate.getTime() + 30 * 60 * 1000).toISOString(), // 30 minutes
    recurrence: {
      type: 'daily',
      interval: 1, // Every day
      endDate: nextMonth.toISOString(),
    },
    createdAt: currentDate.toISOString(),
    updatedAt: currentDate.toISOString(),
    createdBy: 'user123',
    category: 'Work',
  },
  
  // Weekly recurring events
  {
    id: '4',
    title: 'Weekly Planning',
    description: 'Team planning session',
    startDate: nextWeek.toISOString(),
    endDate: new Date(nextWeek.getTime() + 120 * 60 * 1000).toISOString(), // 2 hours
    recurrence: {
      type: 'weekly',
      interval: 1, // Every week
      weekDays: ['monday'], // Only on Mondays
      endDate: new Date(nextMonth.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 3 months
    },
    createdAt: currentDate.toISOString(),
    updatedAt: currentDate.toISOString(),
    createdBy: 'user123',
    category: 'Work',
  },
  
  // Monthly recurring events
  {
    id: '5',
    title: 'Monthly Review',
    description: 'Monthly performance review',
    startDate: nextMonth.toISOString(),
    endDate: new Date(nextMonth.getTime() + 180 * 60 * 1000).toISOString(), // 3 hours
    recurrence: {
      type: 'monthly',
      interval: 1, // Every month
      position: 'first', // First occurrence
      weekDay: 'monday', // First Monday of every month
    },
    createdAt: currentDate.toISOString(),
    updatedAt: currentDate.toISOString(),
    createdBy: 'user123',
    category: 'Work',
  },
  
  // Yearly recurring event
  {
    id: '6',
    title: 'Annual Company Retreat',
    description: 'Team building and planning retreat',
    startDate: new Date(currentDate.getFullYear(), 11, 15).toISOString(), // December 15th
    endDate: new Date(currentDate.getFullYear(), 11, 17).toISOString(), // December 17th
    recurrence: {
      type: 'yearly',
      interval: 1, // Every year
    },
    createdAt: currentDate.toISOString(),
    updatedAt: currentDate.toISOString(),
    createdBy: 'user123',
    category: 'Training',
  },
  
  // Complex weekly recurring event
  {
    id: '7',
    title: 'Bi-weekly Team Training',
    description: 'Alternating technical and soft skills training',
    startDate: currentDate.toISOString(),
    endDate: new Date(currentDate.getTime() + 120 * 60 * 1000).toISOString(), // 2 hours
    recurrence: {
      type: 'weekly',
      interval: 2, // Every other week
      weekDays: ['tuesday', 'thursday'], // On Tuesdays and Thursdays
      endDate: new Date(nextMonth.getTime() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months
    },
    createdAt: currentDate.toISOString(),
    updatedAt: currentDate.toISOString(),
    createdBy: 'user123',
  },
  
  // All-day event
  {
    id: '8',
    title: 'Company Holiday',
    description: 'Office closed for holiday',
    startDate: nextMonth.toISOString(),
    endDate: new Date(nextMonth.getTime() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    isAllDay: true,
    createdAt: currentDate.toISOString(),
    updatedAt: currentDate.toISOString(),
    createdBy: 'user123',
    category: 'Holiday',
  },
];
