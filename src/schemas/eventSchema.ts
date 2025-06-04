import { z } from "zod";
import { recurrenceRuleSchema, FormRecurrenceRule } from "./recurrenceRuleSchema";

// Event schema
export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  calendar: z.string(),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  timezone: z.string().default("UTC"),
  is_recurring: z.boolean().default(false),
  recurrence_rule: recurrenceRuleSchema.optional(),
});

export type FormEvent = z.infer<typeof eventSchema>;

// Backend DTO types
export interface CreateEventDto {
  title: string;
  description?: string;
  calendar: string;
  start_time: string;
  end_time: string;
  timezone: string;
  is_recurring: boolean;
  recurrence_rule?: {
    frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
    interval: number;
    start_date: string;
    end_date?: string;
    pattern: {
      type: "daily" | "weekly" | "monthly" | "yearly";
      skipWeekends?: boolean;
      weekdays?: Array<{ weekday: "MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU" }>;
      by?: "dayOfMonth" | "relativeDay";
      month_days?: Array<{ day: number; month?: string }>;
      relative_days?: Array<{ weekday: "MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU"; ordinal: number; month?: string }>;
    };
  };
}
