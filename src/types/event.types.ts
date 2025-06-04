export type RecurrenceInterval = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type WeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
export type RelativePosition = 'first' | 'second' | 'third' | 'fourth' | 'last';

export interface DailyPattern {
  type: 'daily';
  interval: number; // every n days
  skipWeekends?: boolean;
}

export interface WeeklyPattern {
  type: 'weekly';
  interval: number; // every n weeks
  weekDays: WeekDay[]; // specific days of the week
}

export interface MonthlyPattern {
  type: 'monthly';
  interval: number; // every n months
  by: 'dayOfMonth' | 'relativeDay';
  dayOfMonth?: number; // specific day (1-31)
  relativeDay?: {
    position: RelativePosition;
    weekDay: WeekDay;
  };
}

export interface YearlyPattern {
  type: 'yearly';
  interval: number; // every n years
  by: 'date' | 'relativeDay';
  month: number; // 1-12
  dayOfMonth?: number; // specific day (1-31)
  relativeDay?: {
    position: RelativePosition;
    weekDay: WeekDay;
  };
}

export interface RecurrencePattern {
  pattern: DailyPattern | WeeklyPattern | MonthlyPattern | YearlyPattern;
  endCondition: 'after' | 'on' | 'never';
  times?: number;
  endDate?: string;
}

export interface RecurringEventInstance {
  isRecurringInstance: boolean;
  originalEventId?: string;
}

export type EventCategory = 'Work' | 'Business' | 'Training' | 'Holiday' | 'Personal' | 'Other';

export interface Event extends Partial<RecurringEventInstance> {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  timezone: string;
  is_recurring: boolean;
  recurrence_rule?: string;
  calendar?: string;
  category?: string;
}

export interface CreateEventDto {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  timezone: string;
  is_recurring: boolean;
  recurrence_rule?: RecurrencePattern;
  calendar?: string;
  category?: string;
}

export type UpdateEventDto = Partial<CreateEventDto>;
