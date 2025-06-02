import React from 'react';
import { CalendarIcon } from "@heroicons/react/24/outline";

const DateInput = ({ 
  label, 
  value, 
  onChange, 
  error, 
  calendarType = localStorage.getItem("calendarType") || "GC",
  required = false,
  name,
  className = ""
}) => {
  // Convert GC to ETC date if needed
  const convertToETC = (gcDate) => {
    // This is a placeholder for the actual conversion logic
    // You'll need to implement the actual conversion logic
    return gcDate;
  };

  // Convert ETC to GC date if needed
  const convertToGC = (etcDate) => {
    // This is a placeholder for the actual conversion logic
    // You'll need to implement the actual conversion logic
    return etcDate;
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    if (calendarType === "ETC") {
      // Convert ETC to GC before saving
      onChange(convertToGC(newDate));
    } else {
      onChange(newDate);
    }
  };

  // Display value based on calendar type
  const displayValue = calendarType === "ETC" ? convertToETC(value) : value;

  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-sm text-gray-600 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
        <span className="ml-2 text-xs text-gray-500">({calendarType})</span>
      </label>
      <div className="relative">
        <input
          type="date"
          name={name}
          value={displayValue}
          onChange={handleDateChange}
          className={`
            w-full pl-10 pr-3 py-2 
            border rounded-md 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
            ${error ? 'border-red-500' : 'border-gray-300'}
          `}
        />
        <CalendarIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default DateInput;
