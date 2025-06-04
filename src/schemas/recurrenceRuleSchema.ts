import { z } from "zod";

// Basic types
export type WeekDay = "MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU";
export type MonthCode = "JAN" | "FEB" | "MAR" | "APR" | "MAY" | "JUN" | "JUL" | "AUG" | "SEP" | "OCT" | "NOV" | "DEC";
export type RecurrenceFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
export type RecurrencePatternType = "daily" | "weekly" | "monthly" | "yearly";
const MONTH_ABBREVIATIONS = [
  { value: "JAN", label: "JAN", full: "January" },
  { value: "FEB", label: "FEB", full: "February" },
  { value: "MAR", label: "MAR", full: "March" },
  { value: "APR", label: "APR", full: "April" },
  { value: "MAY", label: "MAY", full: "May" },
  { value: "JUN", label: "JUN", full: "June" },
  { value: "JUL", label: "JUL", full: "July" },
  { value: "AUG", label: "AUG", full: "August" },
  { value: "SEP", label: "SEP", full: "September" },
  { value: "OCT", label: "OCT", full: "October" },
  { value: "NOV", label: "NOV", full: "November" },
  { value: "DEC", label: "DEC", full: "December" },
]

// Supporting types
export interface RecurrenceWeekday {
  weekday: WeekDay;
}

export interface RecurrenceMonthDay {
  day: number;
  month?: MonthCode;
}

export interface RecurrenceRelativeDay {
  weekday: WeekDay;
  ordinal: number;
  month?: MonthCode;
}

// Pattern schemas
const DailyPatternSchema = z.object({
  type: z.literal("daily"),
  skipWeekends: z.boolean(),
});

const WeeklyPatternSchema = z.object({
  type: z.literal("weekly"),
  weekdays: z.array(z.object({ weekday: z.enum(["MO", "TU", "WE", "TH", "FR", "SA", "SU"] as const) })),
});

const MonthlyPatternSchema = z.object({
  type: z.literal("monthly"),
  by: z.enum(["dayOfMonth", "relativeDay"] as const),
  month_days: z.array(z.object({ day: z.number().min(1).max(31) })).optional(),
  relative_days: z.array(z.object({ weekday: z.enum(["MO", "TU", "WE", "TH", "FR", "SA", "SU"] as const), ordinal: z.number() })).optional(),
});

const YearlyPatternSchema = z.object({
  type: z.literal("yearly"),
  by: z.enum(["dayOfMonth", "relativeDay"] as const),
  month_days: z.array(z.object({ day: z.number().min(1).max(31), month: z.enum(MONTH_ABBREVIATIONS.map(m => m.value) as MonthCode[]) })).optional(),
  relative_days: z.array(z.object({ weekday: z.enum(["MO", "TU", "WE", "TH", "FR", "SA", "SU"] as const), ordinal: z.number(), month: z.enum(MONTH_ABBREVIATIONS.map(m => m.value) as MonthCode[]) })).optional(),
});

// Main recurrence rule schema
export const recurrenceRuleSchema = z
  .object({
    frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"] as const),
    interval: z.number().min(1),
    start_date: z.string(),
    end_date: z.string().optional(),
    pattern: z.lazy(() =>
      z.discriminatedUnion("type", [
        DailyPatternSchema,
        WeeklyPatternSchema,
        MonthlyPatternSchema,
        YearlyPatternSchema,
      ])
    ),
  })
  .superRefine((data, ctx) => {
    // Date validation
    if (data.end_date && new Date(data.end_date) < new Date(data.start_date)) {
      ctx.addIssue({
        path: ["end_date"],
        code: z.ZodIssueCode.custom,
        message: "end_date must be after start_date",
      });
    }

    // Interval validation
    if (data.interval < 1) {
      ctx.addIssue({
        path: ["interval"],
        code: z.ZodIssueCode.custom,
        message: "Interval must be at least 1",
      });
    }

    // Pattern-specific validations
    switch (data.pattern.type) {
      case "weekly": {
        if (!data.pattern.weekdays || data.pattern.weekdays.length === 0) {
          ctx.addIssue({
            path: ["pattern", "weekdays"],
            code: z.ZodIssueCode.custom,
            message: "Please select at least one weekday for weekly recurrence.",
          });
        }
        break;
      }
      case "monthly": {
        if (!data.pattern.by) {
          ctx.addIssue({
            path: ["pattern", "by"],
            code: z.ZodIssueCode.custom,
            message: "Please select how the monthly recurrence is determined.",
          });
        } else if (data.pattern.by === "dayOfMonth") {
          if (!data.pattern.month_days || data.pattern.month_days.length === 0) {
            ctx.addIssue({
              path: ["pattern", "month_days"],
              code: z.ZodIssueCode.custom,
              message: "Please select at least one day of month for monthly recurrence.",
            });
          }
        } else if (data.pattern.by === "relativeDay") {
          if (!data.pattern.relative_days || data.pattern.relative_days.length === 0) {
            ctx.addIssue({
              path: ["pattern", "relative_days"],
              code: z.ZodIssueCode.custom,
              message: "Please select at least one relative day for monthly recurrence.",
            });
          }
        }
        break;
      }
      case "yearly": {
        if (!data.pattern.by) {
          ctx.addIssue({
            path: ["pattern", "by"],
            code: z.ZodIssueCode.custom,
            message: "Please select how the yearly recurrence is determined.",
          });
        }
        break;
      }
    }
  });

export type FormRecurrenceRule = z.infer<typeof recurrenceRuleSchema>;
