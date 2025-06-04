"use client"

import type React from "react"
import { useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toDatetimeLocal } from "../../utils/toDateLocalTime"

// Types and interfaces
type WeekDay = "MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU"
type MonthCode = "JAN" | "FEB" | "MAR" | "APR" | "MAY" | "JUN" | "JUL" | "AUG" | "SEP" | "OCT" | "NOV" | "DEC"

interface EventData {
  id?: string
  title: string
  description?: string
  calendar: string
  start_time: string
  end_time: string
  timezone: string
  is_recurring: boolean
  recurrence_rule?: any
}

interface Props {
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
  initialData?: EventData | null
  mode?: "create" | "edit"
}


// Month abbreviations constant matching Django model choices
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

const MONTH_NAMES_SHORT = MONTH_ABBREVIATIONS.map((m) => m.label)

// Map numeric month to month code
const getMonthCode = (monthNumber: number): MonthCode => {
  const monthMap: Record<number, MonthCode> = {
    1: "JAN",
    2: "FEB",
    3: "MAR",
    4: "APR",
    5: "MAY",
    6: "JUN",
    7: "JUL",
    8: "AUG",
    9: "SEP",
    10: "OCT",
    11: "NOV",
    12: "DEC",
  }
  return monthMap[monthNumber]
}

// Map month code to numeric month
const getMonthNumber = (monthCode: MonthCode): number => {
  const monthMap: Record<MonthCode, number> = {
    JAN: 1,
    FEB: 2,
    MAR: 3,
    APR: 4,
    MAY: 5,
    JUN: 6,
    JUL: 7,
    AUG: 8,
    SEP: 9,
    OCT: 10,
    NOV: 11,
    DEC: 12,
  }
  return monthMap[monthCode]
}

// Map ordinal number to Django model value
const getOrdinalValue = (ordinal: number): number => {
  // In the Django model, -1 is "Last", 1 is "1st", 2 is "2nd", etc.
  if (ordinal === 5) return -1 // Map "Last" (5th position in our UI) to -1
  return ordinal
}

// Map Django ordinal value to UI value
const getUIOrderinal = (ordinal: number): number => {
  if (ordinal === -1) return 5 // Map "Last" (-1 in Django) to 5th position in UI
  return ordinal
}

// Recurrence rule schema
const recurrenceRuleSchema = z
  .object({
    frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"] as const),
    interval: z.number().min(1),
    start_date: z.string(),
    end_date: z.string().optional(),
    weekdays: z.array(z.object({ weekday: z.enum(["MO", "TU", "WE", "TH", "FR", "SA", "SU"] as const) })).optional(),
    month_days: z.array(z.object({ day: z.number() })).optional(),
    relative_days: z
      .array(z.object({ weekday: z.enum(["MO", "TU", "WE", "TH", "FR", "SA", "SU"] as const), ordinal: z.number() }))
      .optional(),
    by: z.enum(["dayOfMonth", "relativeDay"] as const).optional(),
    skipWeekends: z.boolean().optional(),
    month: z.array(z.number()).optional(),
    yearly_specific_rules: z.array(z.object({ month: z.number(), days: z.array(z.number()) })).optional(),
    yearly_relative_rules: z
      .array(
        z.object({
          month: z.number(),
          weekday: z.enum(["MO", "TU", "WE", "TH", "FR", "SA", "SU"] as const),
          ordinal: z.number(),
        }),
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Date validation
    if (data.end_date && new Date(data.end_date) < new Date(data.start_date)) {
      ctx.addIssue({
        path: ["end_date"],
        code: z.ZodIssueCode.custom,
        message: "end_date must be after start_date",
      })
    }

    // Interval validation
    if (data.interval < 1) {
      ctx.addIssue({
        path: ["interval"],
        code: z.ZodIssueCode.custom,
        message: "Interval must be at least 1",
      })
    }

    // Weekly
    if (data.frequency === "WEEKLY") {
      if (!data.weekdays || data.weekdays.length === 0) {
        ctx.addIssue({
          path: ["weekdays"],
          code: z.ZodIssueCode.custom,
          message: "Please select at least one weekday for weekly recurrence.",
        })
      }
    }

    // Monthly
    if (data.frequency === "MONTHLY") {
      if (!data.by) {
        ctx.addIssue({
          path: ["by"],
          code: z.ZodIssueCode.custom,
          message: "Please select how the monthly recurrence is determined.",
        })
      } else if (data.by === "dayOfMonth") {
        if (!data.month_days || data.month_days.length === 0) {
          ctx.addIssue({
            path: ["month_days"],
            code: z.ZodIssueCode.custom,
            message: "Please select at least one day of month for monthly recurrence.",
          })
        }
        if (data.month_days) {
          const invalidDays = data.month_days.filter((d) => d.day < 1 || d.day > 31)
          if (invalidDays.length > 0) {
            ctx.addIssue({
              path: ["month_days"],
              code: z.ZodIssueCode.custom,
              message: "Day must be between 1 and 31",
            })
          }
        }
      } else if (data.by === "relativeDay") {
        if (!data.relative_days || data.relative_days.length === 0) {
          ctx.addIssue({
            path: ["relative_days"],
            code: z.ZodIssueCode.custom,
            message: "Please select at least one relative day for monthly recurrence.",
          })
        }
        if (data.relative_days) {
          const invalidOrdinals = data.relative_days.filter((d) => d.ordinal < 1 || d.ordinal > 5)
          if (invalidOrdinals.length > 0) {
            ctx.addIssue({
              path: ["relative_days"],
              code: z.ZodIssueCode.custom,
              message: "Ordinal must be between 1 and 5",
            })
          }
        }
      }
    }

    // Yearly
    if (data.frequency === "YEARLY") {
      if (!data.month || data.month.length === 0) {
        ctx.addIssue({
          path: ["month"],
          code: z.ZodIssueCode.custom,
          message: "Please select at least one month for yearly recurrence.",
        })
      }
      if (!data.by) {
        ctx.addIssue({
          path: ["by"],
          code: z.ZodIssueCode.custom,
          message: "Please select how the yearly recurrence is determined.",
        })
      } else if (data.by === "dayOfMonth") {
        if (!data.yearly_specific_rules || data.yearly_specific_rules.length === 0) {
          ctx.addIssue({
            path: ["yearly_specific_rules"],
            code: z.ZodIssueCode.custom,
            message: "Please provide specific days for yearly recurrence.",
          })
        }
        if (data.yearly_specific_rules) {
          const invalidDays = data.yearly_specific_rules.some((rule) => rule.days.some((day) => day < 1 || day > 31))
          if (invalidDays) {
            ctx.addIssue({
              path: ["yearly_specific_rules"],
              code: z.ZodIssueCode.custom,
              message: "Day must be between 1 and 31",
            })
          }
        }
      } else if (data.by === "relativeDay") {
        if (!data.yearly_relative_rules || data.yearly_relative_rules.length === 0) {
          ctx.addIssue({
            path: ["yearly_relative_rules"],
            code: z.ZodIssueCode.custom,
            message: "Please provide relative rules for yearly recurrence.",
          })
        }
        if (data.yearly_relative_rules) {
          const invalidOrdinals = data.yearly_relative_rules.some(
            (rule) => rule.ordinal !== undefined && (rule.ordinal < 1 || rule.ordinal > 5),
          )
          if (invalidOrdinals) {
            ctx.addIssue({
              path: ["yearly_relative_rules"],
              code: z.ZodIssueCode.custom,
              message: "Ordinal must be between 1 and 5",
            })
          }
        }
      }
    }
  })

type FormRecurrenceRule = z.infer<typeof recurrenceRuleSchema>

// Main event schema
const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  calendar: z.string(),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  timezone: z.string().default("UTC"),
  is_recurring: z.boolean().default(false),
  recurrence_rule: recurrenceRuleSchema.optional(),
})

// Helper function to get best text color for contrast
const getBestTextColor = (bgColor: string): string => {
  // Convert hex to RGB
  const hex = bgColor.replace("#", "")
  const r = Number.parseInt(hex.substr(0, 2), 16)
  const g = Number.parseInt(hex.substr(2, 2), 16)
  const b = Number.parseInt(hex.substr(4, 2), 16)

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  return luminance > 0.5 ? "#000000" : "#FFFFFF"
}

interface CalendarSelectProps {
  calendars: Array<{ id: string; name: string; color: string }>
  value: string
  onChange: (id: string) => void
}

const CalendarSelect: React.FC<CalendarSelectProps> = ({ calendars, value, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {calendars?.map((calendar) => (
        <button
          key={calendar.id}
          type="button"
          onClick={() => onChange(calendar.id)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center space-x-2
            ${value === calendar.id ? "ring-2 ring-offset-2" : "hover:ring-2 hover:ring-offset-2 hover:ring-gray-300"}`}
          style={{
            backgroundColor: calendar.color,
            color: getBestTextColor(calendar.color),
          }}
        >
          <span>{calendar.name}</span>
        </button>
      ))}
    </div>
  )
}

// Helper function to transform backend data to form data
const transformBackendToForm = (data: EventData): any => {
  const formData: any = {
    title: data.title,
    description: data.description || "",
    calendar: data.calendar,
    start_time: toDatetimeLocal(data.start_time),
    end_time: toDatetimeLocal(data.end_time),
    timezone: data.timezone,
    is_recurring: data.is_recurring,
  }

  if (data.is_recurring && data.recurrence_rule) {
    const rule = data.recurrence_rule
    const transformedRule: any = {
      frequency: rule.frequency,
      interval: rule.interval,
      start_date: rule.start_date,
      end_date: rule.end_date || undefined,
      weekdays: rule.weekdays || [],
      month_days: rule.month_days || [],
      relative_days: rule.relative_days || [],
      by: rule.by || undefined,
      month: rule.month || [],
      yearly_specific_rules: rule.yearly_specific_rules || [],
      yearly_relative_rules: rule.yearly_relative_rules || [],
    }

    // Transform weekdays
    if (rule.weekdays && rule.weekdays.length > 0) {
      transformedRule.weekdays = rule.weekdays
    }

    // Transform month_days and relative_days based on frequency
    if (rule.frequency === "MONTHLY") {
      // For monthly, check if we have month_days or relative_days
      if (rule.month_days && rule.month_days.length > 0) {
        transformedRule.by = "dayOfMonth"
        transformedRule.month_days = rule.month_days.map((md: any) => ({
          day: md.day,
        }))
      }
      
      if (rule.relative_days && rule.relative_days.length > 0) {
        transformedRule.by = "relativeDay"
        transformedRule.relative_days = rule.relative_days.map((rd: any) => ({
          weekday: rd.weekday,
          ordinal: getUIOrderinal(rd.ordinal),
        }))
      }
    } else if (rule.frequency === "YEARLY") {
      // For yearly, we need to group by month
      
      // Process month_days for yearly
      if (rule.month_days && rule.month_days.length > 0) {
        transformedRule.by = "dayOfMonth"
        
        // Group days by month
        const monthGroups: Record<string, number[]> = {}
        const months: number[] = []
        
        rule.month_days.forEach((md: any) => {
          if (md.month) {
            const monthNum = getMonthNumber(md.month as MonthCode)
            if (!monthGroups[monthNum]) {
              monthGroups[monthNum] = []
              months.push(monthNum)
            }
            monthGroups[monthNum].push(md.day)
          }
        })
        
        transformedRule.month = months.sort((a, b) => a - b)
        transformedRule.yearly_specific_rules = Object.entries(monthGroups).map(([month, days]) => ({
          month: Number(month),
          days: days.sort((a, b) => a - b),
        }))
      }
      
      // Process relative_days for yearly
      if (rule.relative_days && rule.relative_days.length > 0) {
        transformedRule.by = "relativeDay"
        
        const months: number[] = []
        const relativeRules: any[] = []
        
        rule.relative_days.forEach((rd: any) => {
          if (rd.month) {
            const monthNum = getMonthNumber(rd.month as MonthCode)
            if (!months.includes(monthNum)) {
              months.push(monthNum)
            }
            
            relativeRules.push({
              month: monthNum,
              weekday: rd.weekday,
              ordinal: getUIOrderinal(rd.ordinal),
            })
          }
        })
        
        transformedRule.month = [...new Set([...transformedRule.month, ...months])].sort((a, b) => a - b)
        transformedRule.yearly_relative_rules = relativeRules
      }
      
      // If no specific rules were found but it's a yearly recurrence,
      // we still need to set a default month
      if (transformedRule.month.length === 0) {
        // Default to current month if no month is specified
        const currentMonth = new Date().getMonth() + 1 // JavaScript months are 0-indexed
        transformedRule.month = [currentMonth]
        transformedRule.by = "dayOfMonth" // Default to dayOfMonth
      }
    }

    formData.recurrence_rule = transformedRule
  }

  return formData
}

export const EventForm: React.FC<Props> = ({ onSubmit, onCancel, initialData = null, mode = "create", categories }) => {
  const isEditMode =  initialData?true:false

  const methods = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      calendar: categories[0]?.id || "",
      start_time: "",
      end_time: "",
      timezone: "UTC",
      is_recurring: false,
    },
  })

  const { setValue, watch, reset } = methods
  const isRecurring = watch("is_recurring")
  const recurrenceRuleValues = watch("recurrence_rule")
useEffect(()=>{

  console.log(methods.formState.errors," it is error")
})
  // Load initial data when in edit mode
  useEffect(() => {
    if (isEditMode && initialData) {
      console.log("Loading initial data:", initialData)
      const formData = transformBackendToForm(initialData)
      console.log("Transformed form data:", formData)
      reset(formData)
    }
  }, [isEditMode, initialData, reset])

  useEffect(() => {
    if (isRecurring && !methods.getValues("recurrence_rule")) {
      methods.setValue("recurrence_rule", {
        frequency: "DAILY",
        interval: 1,
        start_date: new Date().toISOString().split("T")[0],
        end_date: undefined,
        weekdays: undefined,
        month_days: undefined,
        relative_days: undefined,
        by: undefined,
        skipWeekends: undefined,
        month: undefined,
        yearly_specific_rules: undefined,
        yearly_relative_rules: undefined,
      })
    } else if (!isRecurring) {
      methods.setValue("recurrence_rule", undefined)
    }
  }, [isRecurring, methods])

  const toggleMonthDay = (day: number): void => {
    const currentRecurrenceRule = methods.getValues("recurrence_rule") as FormRecurrenceRule | undefined
    const currentMonthDays: { day: number }[] = currentRecurrenceRule?.month_days || []
    const dayIndex = currentMonthDays.findIndex((dObj) => dObj.day === day)
    let newMonthDays: { day: number }[]
    if (dayIndex > -1) {
      newMonthDays = currentMonthDays.filter((_, i) => i !== dayIndex)
    } else {
      newMonthDays = [...currentMonthDays, { day }]
    }
    newMonthDays.sort((a, b) => a.day - b.day)
    methods.setValue("recurrence_rule.month_days", newMonthDays, { shouldValidate: true, shouldDirty: true })
  }

  const toggleRelativeDay = (weekday: WeekDay, ordinal: number): void => {
    const currentRecurrenceRule = methods.getValues("recurrence_rule") as FormRecurrenceRule | undefined
    const currentRelativeDays: { weekday: WeekDay; ordinal: number }[] = currentRecurrenceRule?.relative_days || []
    const dayIndex = currentRelativeDays.findIndex((d) => d.weekday === weekday && d.ordinal === ordinal)
    let newRelativeDays: { weekday: WeekDay; ordinal: number }[]

    if (dayIndex > -1) {
      newRelativeDays = currentRelativeDays.filter((_, i) => i !== dayIndex)
    } else {
      newRelativeDays = [...currentRelativeDays, { weekday, ordinal }]
    }

    methods.setValue("recurrence_rule.relative_days", newRelativeDays, { shouldValidate: true, shouldDirty: true })
  }

  const toggleYearlyMonth = (monthToToggle: number): void => {
    const currentRecurrenceRule = methods.getValues("recurrence_rule") as FormRecurrenceRule | undefined
    const currentSelectedMonths: number[] | undefined = currentRecurrenceRule?.month
    const newSelectedMonths = currentSelectedMonths ? [...currentSelectedMonths] : []
    const index = newSelectedMonths.indexOf(monthToToggle)

    if (index > -1) {
      newSelectedMonths.splice(index, 1)

      // Clear specific rules for this deselected month
      const currentSpecificRules: { month: number; days: number[] }[] =
        currentRecurrenceRule?.yearly_specific_rules || []
      const updatedSpecificRules = currentSpecificRules.filter((rule) => rule.month !== monthToToggle)
      methods.setValue(
        "recurrence_rule.yearly_specific_rules",
        updatedSpecificRules.length > 0 ? updatedSpecificRules : undefined,
        { shouldValidate: true, shouldDirty: true },
      )

      // Clear relative rules for this deselected month
      const currentRelativeRules: Array<{ month: number; ordinal?: number; weekday?: WeekDay }> =
        currentRecurrenceRule?.yearly_relative_rules || []
      const updatedRelativeRules = currentRelativeRules.filter((rule) => rule.month !== monthToToggle)
      methods.setValue(
        "recurrence_rule.yearly_relative_rules",
        updatedRelativeRules.length > 0 ? updatedRelativeRules : undefined,
        { shouldValidate: true, shouldDirty: true },
      )
    } else {
      newSelectedMonths.push(monthToToggle)
    }

    const finalMonths = newSelectedMonths.length > 0 ? newSelectedMonths.sort((a, b) => a - b) : undefined
    methods.setValue("recurrence_rule.month", finalMonths, { shouldValidate: true, shouldDirty: true })
  }

  const toggleYearlySpecificDay = (monthNumber: number, dayToToggle: number): void => {
    const currentRecurrenceRule = methods.getValues("recurrence_rule")
    const currentRules: { month: number; days: number[] }[] = currentRecurrenceRule?.yearly_specific_rules || []
    const newRules = JSON.parse(JSON.stringify(currentRules))
    const monthRuleIndex = newRules.findIndex((rule) => rule.month === monthNumber)

    if (monthRuleIndex > -1) {
      const daysForMonth = [...newRules[monthRuleIndex].days]
      const dayIndex = daysForMonth.indexOf(dayToToggle)
      if (dayIndex > -1) {
        daysForMonth.splice(dayIndex, 1)
      } else {
        daysForMonth.push(dayToToggle)
        daysForMonth.sort((a, b) => a - b)
      }
      if (daysForMonth.length > 0) {
        newRules[monthRuleIndex] = { ...newRules[monthRuleIndex], days: daysForMonth }
      } else {
        newRules.splice(monthRuleIndex, 1)
      }
    } else {
      newRules.push({ month: monthNumber, days: [dayToToggle] })
    }

    newRules.sort((a, b) => a.month - b.month)
    methods.setValue("recurrence_rule.yearly_specific_rules", newRules.length > 0 ? newRules : undefined, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const updateYearlyRelativeRule = (
    monthNumber: number,
    part: "ordinal" | "weekday",
    value: number | WeekDay | undefined,
  ): void => {
    const currentRecurrenceRule = methods.getValues("recurrence_rule")
    const currentRules: Array<{ month: number; ordinal?: number; weekday?: WeekDay }> =
      currentRecurrenceRule?.yearly_relative_rules || []
    const newRules = JSON.parse(JSON.stringify(currentRules))
    const monthRuleIndex = newRules.findIndex((rule) => rule.month === monthNumber)

    let ruleForMonth: { month: number; ordinal?: number; weekday?: WeekDay }

    if (monthRuleIndex > -1) {
      ruleForMonth = { ...newRules[monthRuleIndex] }
    } else {
      ruleForMonth = { month: monthNumber }
    }

    if (part === "ordinal") {
      ruleForMonth.ordinal = value as number | undefined
    } else if (part === "weekday") {
      ruleForMonth.weekday = value as WeekDay | undefined
    }

    if (ruleForMonth.ordinal === undefined && ruleForMonth.weekday === undefined) {
      if (monthRuleIndex > -1) {
        newRules.splice(monthRuleIndex, 1)
      }
    } else {
      if (monthRuleIndex > -1) {
        newRules[monthRuleIndex] = ruleForMonth
      } else {
        newRules.push(ruleForMonth)
      }
    }

    newRules.sort((a, b) => a.month - b.month)
    methods.setValue("recurrence_rule.yearly_relative_rules", newRules.length > 0 ? newRules : undefined, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const transformYearlyData = (recurrenceRule: FormRecurrenceRule) => {
    const monthDays: Array<{ day: number; month: string | null }> = []
    const relativeDays: Array<{ weekday: WeekDay; ordinal: number; month: string | null }> = []

    if (recurrenceRule.frequency === "YEARLY") {
      if (recurrenceRule.by === "dayOfMonth" && recurrenceRule.yearly_specific_rules) {
        // Transform yearly specific rules to month_days format
        recurrenceRule.yearly_specific_rules.forEach((rule) => {
          rule.days.forEach((day) => {
            monthDays.push({ day, month: getMonthCode(rule.month) })
          })
        })
      }

      if (recurrenceRule.by === "relativeDay" && recurrenceRule.yearly_relative_rules) {
        // Transform yearly relative rules to relative_days format
        recurrenceRule.yearly_relative_rules.forEach((rule) => {
          relativeDays.push({
            weekday: rule.weekday,
            ordinal: getOrdinalValue(rule.ordinal),
            month: getMonthCode(rule.month),
          })
        })
      }
    }

    return { monthDays, relativeDays }
  }

  const onFormSubmit = async (formValues: z.infer<typeof eventSchema>): Promise<void> => {
    try {
      const transformedData: any = {
        title: formValues.title,
        description: formValues.description || "",
        calendar: formValues.calendar,
        start_time: formValues.start_time,
        end_time: formValues.end_time,
        timezone: formValues.timezone,
        is_recurring: formValues.is_recurring,
      }

      // Include ID for edit mode
      if (isEditMode && initialData?.id) {
        transformedData.id = initialData.id
      }

      if (formValues.is_recurring && formValues.recurrence_rule) {
        const rule = formValues.recurrence_rule
        let monthDays: Array<{ day: number; month: string | null }> = []
        let relativeDays: Array<{ weekday: WeekDay; ordinal: number; month: string | null }> = []

        // Handle different frequency types
        if (rule.frequency === "MONTHLY") {
          // For monthly, month is null in the serializer
          monthDays = rule.month_days?.map((d) => ({ day: d.day, month: null })) || []
          relativeDays =
            rule.relative_days?.map((d) => ({
              weekday: d.weekday,
              ordinal: getOrdinalValue(d.ordinal),
              month: null,
            })) || []
        } else if (rule.frequency === "YEARLY") {
          // For yearly, transform the yearly-specific data
          const yearlyData = transformYearlyData(rule)
          monthDays = yearlyData.monthDays
          relativeDays = yearlyData.relativeDays
        }

        transformedData.recurrence_rule = {
          frequency: rule.frequency,
          interval: rule.interval,
          start_date: rule.start_date,
          end_date: rule.end_date || null,
          weekdays: rule.weekdays?.map((w) => ({ weekday: w.weekday })) || [],
          month_days: monthDays,
          relative_days: relativeDays,
        }
        
        // Include ID for edit mode
        if (isEditMode && initialData?.recurrence_rule?.id) {
          transformedData.recurrence_rule.id = initialData.recurrence_rule.id
        }
      } else {
        // transformedData.recurrence_rule = null
      }

      console.log("Transformed data for backend:", transformedData)
      await onSubmit(transformedData)
    } catch (error) {
      console.error("Error submitting form:", error)
      // You might want to show an error message to the user here
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onFormSubmit)}
        className="space-y-6 bg-white p-6 rounded-lg border max-w-4xl mx-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{isEditMode ? "Edit Event" : "Schedule Event"}</h2>
        </div>

        <div className="space-y-6">
          {/* Event Type Toggle */}
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-full w-fit">
            <button
              type="button"
              onClick={() => setValue("is_recurring", false)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!isRecurring ? "bg-white shadow-sm text-gray-900" : "text-gray-600"}`}
            >
              One-time event
            </button>
            <button
              type="button"
              onClick={() => setValue("is_recurring", true)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${isRecurring ? "bg-white shadow-sm text-gray-900" : "text-gray-600"}`}
            >
              Recurring event
            </button>
          </div>

          {/* Basic Event Details */}
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                id="title"
                type="text"
                {...methods.register("title")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                placeholder="Event title"
              />
              {methods.formState.errors.title && (
                <p className="text-sm text-red-600 mt-1">{methods.formState.errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  id="start_time"
                  type="datetime-local"
                  {...methods.register("start_time")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                />
                {methods.formState.errors.start_time && (
                  <p className="text-sm text-red-600 mt-1">{methods.formState.errors.start_time.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  id="end_time"
                  type="datetime-local"
                  {...methods.register("end_time")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                />
                {methods.formState.errors.end_time && (
                  <p className="text-sm text-red-600 mt-1">{methods.formState.errors.end_time.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                {...methods.register("description")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                placeholder="Event description (optional)"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Calendar</label>
              <CalendarSelect
                calendars={categories}
                value={watch("calendar") || ""}
                onChange={(value: string) => setValue("calendar", value)}
              />
            </div>
          </div>

          {/* Recurring Event Settings */}
          {isRecurring && (
            <div className="mt-4 p-4 border rounded-md space-y-4 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">Recurrence Settings</h3>

              {/* Recurrence Settings */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <select
                    {...methods.register("recurrence_rule.frequency")}
                    className="w-full rounded-md py-3  border-primary-500 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="YEARLY">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interval</label>
                  <input
                    type="number"
                    {...methods.register("recurrence_rule.interval", { valueAsNumber: true })}
                    className="w-full rounded-md py-3 px-3 border-primary-500 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="1"
                  />
                </div>

         

                {/* Weekly Weekdays */}
                {recurrenceRuleValues?.frequency === "WEEKLY" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weekdays</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { code: "MO", label: "Monday" },
                        { code: "TU", label: "Tuesday" },
                        { code: "WE", label: "Wednesday" },
                        { code: "TH", label: "Thursday" },
                        { code: "FR", label: "Friday" },
                        { code: "SA", label: "Saturday" },
                        { code: "SU", label: "Sunday" },
                      ].map((day) => {
                        const isSelected = recurrenceRuleValues?.weekdays?.some((d) => d.weekday === day.code)
                        return (
                          <button
                            key={day.code}
                            type="button"
                            onClick={() => {
                              const currentWeekdays = recurrenceRuleValues?.weekdays || []
                              const exists = currentWeekdays.some((d) => d.weekday === day.code)
                              let newWeekdays
                              if (exists) {
                                newWeekdays = currentWeekdays.filter((d) => d.weekday !== day.code)
                              } else {
                                newWeekdays = [...currentWeekdays, { weekday: day.code as WeekDay }]
                              }
                              setValue("recurrence_rule.weekdays", newWeekdays, {
                                shouldValidate: true,
                                shouldDirty: true,
                              })
                            }}
                            className={`px-3 py-1 rounded-md text-sm ${
                              isSelected ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {day.code}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Monthly Specific/Relative Selection */}
                {recurrenceRuleValues?.frequency === "MONTHLY" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Recurrence Type</label>
                    <select
                      {...methods.register("recurrence_rule.by")}
                      className="w-full   rounded-md py-3 px-3 border-primary-500 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select type...</option>
                      <option value="dayOfMonth">Specific Day of Month</option>
                      <option value="relativeDay">Relative Day</option>
                    </select>
                  </div>
                )}

                {/* Monthly Specific Days */}
                {recurrenceRuleValues?.frequency === "MONTHLY" && recurrenceRuleValues?.by === "dayOfMonth" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Days of Month</label>
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleMonthDay(day)}
                          className={`px-3 py-1 rounded-md text-sm ${
                            recurrenceRuleValues?.month_days?.some((d) => d.day === day)
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Monthly Relative Days */}
                {recurrenceRuleValues?.frequency === "MONTHLY" && recurrenceRuleValues?.by === "relativeDay" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Relative Days</label>
                    <div className="space-y-4">
                      {["MO", "TU", "WE", "TH", "FR", "SA", "SU"].map((weekday) => (
                        <div key={weekday} className="flex items-center space-x-2">
                          <span className="text-gray-600 w-8">{weekday}</span>
                          {[
                            { value: 1, label: "1st" },
                            { value: 2, label: "2nd" },
                            { value: 3, label: "3rd" },
                            { value: 4, label: "4th" },
                            { value: 5, label: "Last" },
                          ].map((ordinal) => (
                            <button
                              key={`${weekday}-${ordinal.label}`}
                              type="button"
                              onClick={() => toggleRelativeDay(weekday as WeekDay, ordinal.value)}
                              className={`px-3 py-1 rounded-md text-sm ${
                                recurrenceRuleValues?.relative_days?.some(
                                  (d) => d.weekday === weekday && d.ordinal === ordinal.value,
                                )
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {ordinal.label}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Yearly Pattern Options */}
                {recurrenceRuleValues?.frequency === "YEARLY" && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Yearly recurrence type</label>
                      <div className="flex gap-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            value="dayOfMonth"
                            id="yearly-dayOfMonth"
                            {...methods.register("recurrence_rule.by")}
                          />
                          <label htmlFor="yearly-dayOfMonth">Specific date</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            value="relativeDay"
                            id="yearly-relativeDay"
                            {...methods.register("recurrence_rule.by")}
                          />
                          <label htmlFor="yearly-relativeDay">Relative day</label>
                        </div>
                      </div>
                    </div>

                    {/* Month Selection Grid */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        In month(s):
                        {methods.formState.errors.recurrence_rule?.month && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 p-2 border rounded-md bg-white mt-2">
                        {MONTH_NAMES_SHORT.map((monthName, index) => {
                          const monthNumber = index + 1
                          const selectedMonthsForYearly = recurrenceRuleValues?.month || []
                          const isSelected = selectedMonthsForYearly.includes(monthNumber)
                          return (
                            <button
                              key={monthNumber}
                              type="button"
                              onClick={() => toggleYearlyMonth(monthNumber)}
                              className={`py-2 px-1 border rounded text-xs text-center transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                                ${
                                  isSelected
                                    ? "bg-blue-600 text-white font-semibold ring-2 ring-blue-400 ring-offset-1"
                                    : "bg-white hover:bg-gray-100 text-gray-700"
                                }`}
                            >
                              {monthName}
                            </button>
                          )
                        })}
                      </div>
                      {methods.formState.errors.recurrence_rule?.month && (
                        <p className="text-sm text-red-600 mt-1">Please select at least one month.</p>
                      )}
                    </div>

                    {/* Specific Date Configuration */}
                    {recurrenceRuleValues?.by === "dayOfMonth" && (recurrenceRuleValues?.month || []).length > 0 && (
                      <div className="mt-4 space-y-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Select specific days for each month:
                        </label>
                        {(recurrenceRuleValues?.month || []).map((monthNumber) => {
                          const yearlySpecificRules = recurrenceRuleValues?.yearly_specific_rules || []
                          const daysForThisMonth =
                            yearlySpecificRules.find((rule) => rule.month === monthNumber)?.days || []

                          return (
                            <div key={monthNumber} className="p-3 border rounded-md bg-gray-50/50 shadow-sm">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Days for {MONTH_NAMES_SHORT[monthNumber - 1]}:
                              </label>
                              <div className="grid grid-cols-7 gap-2 p-2 border rounded-md max-w-xs bg-white">
                                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                                  const isSelected = daysForThisMonth.includes(day)
                                  return (
                                    <button
                                      type="button"
                                      key={`${monthNumber}-${day}`}
                                      onClick={() => toggleYearlySpecificDay(monthNumber, day)}
                                      className={`p-1.5 border rounded text-xs text-center transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                                        ${
                                          isSelected
                                            ? "bg-blue-600 text-white font-semibold ring-2 ring-blue-400 ring-offset-1"
                                            : "bg-white hover:bg-gray-100 text-gray-700"
                                        }`}
                                    >
                                      {day}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Relative Day Configuration */}
                    {recurrenceRuleValues?.by === "relativeDay" && (recurrenceRuleValues?.month || []).length > 0 && (
                      <div className="mt-4 space-y-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Configure relative day for each month:
                        </label>
                        {(recurrenceRuleValues?.month || []).map((monthNumber) => {
                          const yearlyRelativeRules = recurrenceRuleValues?.yearly_relative_rules || []
                          const ruleForThisMonth = yearlyRelativeRules.find((rule) => rule.month === monthNumber)

                          return (
                            <div key={monthNumber} className="p-3 border rounded-md bg-gray-50/50 shadow-sm">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rule for {MONTH_NAMES_SHORT[monthNumber - 1]}:
                              </label>
                              <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                  <label className="text-xs text-gray-600">Position</label>
                                  <select
                                    value={ruleForThisMonth?.ordinal || ""}
                                    onChange={(e) =>
                                      updateYearlyRelativeRule(
                                        monthNumber,
                                        "ordinal",
                                        e.target.value ? Number.parseInt(e.target.value) : undefined,
                                      )
                                    }
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-white"
                                  >
                                    <option value="" disabled>
                                      Position...
                                    </option>
                                    <option value="1">First</option>
                                    <option value="2">Second</option>
                                    <option value="3">Third</option>
                                    <option value="4">Fourth</option>
                                    <option value="5">Last</option>
                                  </select>
                                </div>
                                <div className="flex-1">
                                  <label className="text-xs text-gray-600">Weekday</label>
                                  <select
                                    value={ruleForThisMonth?.weekday || ""}
                                    onChange={(e) =>
                                      updateYearlyRelativeRule(
                                        monthNumber,
                                        "weekday",
                                        e.target.value as WeekDay | undefined,
                                      )
                                    }
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-white"
                                  >
                                    <option value="" disabled>
                                      Weekday...
                                    </option>
                                    <option value="MO">Monday</option>
                                    <option value="TU">Tuesday</option>
                                    <option value="WE">Wednesday</option>
                                    <option value="TH">Thursday</option>
                                    <option value="FR">Friday</option>
                                    <option value="SA">Saturday</option>
                                    <option value="SU">Sunday</option>
                                  </select>
                                </div>
                              </div>
                              {ruleForThisMonth?.ordinal && ruleForThisMonth?.weekday && (
                                <div className="mt-2 text-xs text-gray-600 bg-blue-50 p-2 rounded">
                                  <strong>Preview:</strong> {(() => {
                                    const positions = { 1: "First", 2: "Second", 3: "Third", 4: "Fourth", 5: "Last" }
                                    const weekdays = {
                                      MO: "Monday",
                                      TU: "Tuesday",
                                      WE: "Wednesday",
                                      TH: "Thursday",
                                      FR: "Friday",
                                      SA: "Saturday",
                                      SU: "Sunday",
                                    }
                                    return `${positions[ruleForThisMonth.ordinal as keyof typeof positions]} ${weekdays[ruleForThisMonth.weekday as keyof typeof weekdays]} of ${MONTH_NAMES_SHORT[monthNumber - 1]}`
                                  })()}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      {...methods.register("recurrence_rule.start_date")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
                    <input
                      type="date"
                      {...methods.register("recurrence_rule.end_date")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isEditMode
              ? watch("is_recurring")
                ? "Update Recurring Event"
                : "Update Event"
              : watch("is_recurring")
                ? "Save Recurring Event"
                : "Save Event"}
          </button>
        </div>
      </form>
    </FormProvider>
  )
}
