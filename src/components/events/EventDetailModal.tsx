
import { useState } from "react"
import Modal  from "../common/Modal"
import { EventData } from "../../types/event"
import { format } from "date-fns"

interface Props {
  isOpen: boolean
  onClose: () => void
  event: EventData | null
}

export const EventDetailModal: React.FC<Props> = ({ isOpen, onClose, event }) => {
  if (!event) return null

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM d, yyyy HH:mm")
  }

  const formatRecurrence = () => {
    if (!event.recurrence_rule) return "One-time event"

    const { frequency, interval, start_date, end_date, weekdays, month_days, relative_days, by } = event.recurrence_rule
    
    const frequencyMap: Record<string, string> = {
      DAILY: "Daily",
      WEEKLY: "Weekly",
      MONTHLY: "Monthly",
      YEARLY: "Yearly",
    }

    let recurrenceText = `${frequencyMap[frequency]} every ${interval} ${frequency.toLowerCase()}(s)`

    if (frequency === "WEEKLY" && weekdays) {
      const weekdayMap: Record<string, string> = {
        MO: "Monday",
        TU: "Tuesday",
        WE: "Wednesday",
        TH: "Thursday",
        FR: "Friday",
        SA: "Saturday",
        SU: "Sunday",
      }
      const days = weekdays.map(w => weekdayMap[w.weekday]).join(", ")
      recurrenceText += ` on ${days}`
    }

    if (frequency === "MONTHLY" && by === "dayOfMonth" && month_days) {
      const days = month_days.map(md => md.day).join(", ")
      recurrenceText += ` on day(s) ${days} of the month`
    }

    if (frequency === "MONTHLY" && by === "relativeDay" && relative_days) {
      const ordinalMap: Record<number, string> = {
        1: "1st",
        2: "2nd",
        3: "3rd",
        4: "4th",
        5: "Last",
      }
      const days = relative_days.map(rd => `${ordinalMap[rd.ordinal]} ${rd.weekday}`).join(", ")
      recurrenceText += ` on ${days} of the month`
    }

    if (end_date) {
      recurrenceText += ` until ${formatDate(end_date)}`
    }

    return recurrenceText
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="60" title="Event Details">
      <div className="space-y-6 p-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Title</label>
              <p className="text-sm text-gray-900">{event.title}</p>
            </div>
            {event.description && (
              <div>
                <label className="block text-sm font-medium text-gray-500">Description</label>
                <p className="text-sm text-gray-900">{event.description}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-500">Calendar</label>
              <p className="text-sm text-gray-900">{event.calendar}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900">Time & Location</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Start Time</label>
              <p className="text-sm text-gray-900">{formatDate(event.start_time)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">End Time</label>
              <p className="text-sm text-gray-900">{formatDate(event.end_time)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Timezone</label>
              <p className="text-sm text-gray-900">{event.timezone}</p>
            </div>
          </div>
        </div>

        {event.recurrence_rule && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">Recurrence Pattern</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Recurrence</label>
                <p className="text-sm text-gray-900">{formatRecurrence()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
