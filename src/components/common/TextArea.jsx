// InputField.jsx
import React from "react";
import { useFormContext, Controller } from "react-hook-form";

const TextArea = React.forwardRef(
  (
    {
      name,
      label,
      placeholder,
      rows = 4,
      control: externalControl,
      errors: externalErrors,
    },
    ref
  ) => {
    // Use external control if provided, otherwise try to get from context
    const formContext = useFormContext();
    const control = externalControl || formContext?.control;
    const errors = externalErrors || formContext?.formState?.errors || {};

    // If no control is available, render a standard textarea
    if (!control) {
      return (
        <div className="mb-4">
          {label && (
            <label
              htmlFor={name}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {label}
            </label>
          )}
          <textarea
            ref={ref}
            name={name}
            rows={rows}
            placeholder={placeholder}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-[1px] focus:ring-primary"
          />
        </div>
      );
    }

    return (
      <div className="mb-4">
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <Controller
          name={name}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <textarea
              {...field}
              id={name}
              rows={rows}
              placeholder={placeholder}
              className={`w-full px-3 py-2 border ${
                errors[name]
                  ? "border-red-500"
                  : "border-primary focus:border-primary"
              } rounded-md focus:outline-none focus:ring-[1px] focus:ring-primary`}
            />
          )}
        />
        {errors[name] && (
          <p className="text-red-500 text-sm mt-1">{errors[name]?.message}</p>
        )}
      </div>
    );
  }
);

export default TextArea;
