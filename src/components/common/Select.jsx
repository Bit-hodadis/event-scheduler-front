import React, { useState } from "react";
import { FiChevronDown, FiSearch, FiCheck, FiX } from "react-icons/fi";
import { useFormContext, Controller } from "react-hook-form";

const Select = React.forwardRef(
  (
    {
      options,
      name,
      label,
      is_on_field_search = true,
      placeholder = "Select",
      is_multiple = false,
      control: externalControl,
      errors: externalErrors,
      onSearch,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Use external control if provided, otherwise try to get from context
    const formContext = useFormContext();
    const control = externalControl || formContext?.control;
    const errors = externalErrors || formContext?.formState?.errors || {};

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    const filteredOptions = is_on_field_search
      ? options?.filter((option) =>
          option?.label?.toLowerCase()?.includes(searchTerm?.toLowerCase())
        )
      : options;

    // If no control is available, render a standard select
    if (!control) {
      return (
        <div className="relative w-full">
          {label && (
            <label
              htmlFor={name}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {label}
            </label>
          )}
          <select
            name={name}
            ref={ref}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-[1px] focus:ring-primary"
          >
            <option value="">{placeholder}</option>
            {options?.map((option) => (
              <option key={option?.id} value={option?.id}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div className="relative w-full">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>

        <Controller
          name={name}
          control={control}
          render={({ field: { value, onChange } }) => (
            <>
              <div
                className={`flex items-center justify-between bg-white border ${
                  errors[name] ? "border-red-500" : "border-gray-300"
                } rounded-lg px-4 py-2 cursor-pointer`}
                onClick={toggleDropdown}
              >
                <div className="flex flex-wrap gap-2">
                  {value ? (
                    is_multiple ? (
                      value.map((id) => {
                        const selectedOption = options.find(
                          (option) => option.id.toString() === id.toString()
                        );
                        return (
                          <span
                            key={id}
                            className="flex items-center bg-primary/10 text-primary text-sm px-2 py-1 rounded"
                          >
                            {selectedOption?.label}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-gray-700">
                        {options?.find(
                          (option) =>
                            option?.id?.toString() === value?.toString()
                        )?.label || value}
                      </span>
                    )
                  ) : (
                    <span className="text-gray-500">{placeholder}</span>
                  )}
                </div>

                <FiChevronDown
                  className={`transform transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Dropdown List */}
              {isOpen && (
                <div className="absolute z-40 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                  {/* Search Input */}
                  <div className="flex items-center bg-gray-100 px-4 py-2">
                    <FiSearch className="text-gray-500 mr-2" />
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);

                        onSearch(e.target.value);
                      }}
                      className="w-full bg-transparent border-primary focus:border-primary focus:outline-none outline-none"
                    />
                  </div>
                  {/* Options */}
                  <ul className="max-h-40 overflow-y-auto">
                    {filteredOptions?.length > 0 ? (
                      filteredOptions?.map((option) => (
                        <li
                          key={option?.id}
                          className={`flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                            is_multiple
                              ? value?.includes(option?.id)
                                ? "bg-gray-200"
                                : ""
                              : value === option?.id
                              ? "bg-gray-200"
                              : ""
                          }`}
                          onClick={() => {
                            if (is_multiple) {
                              const currentValue = value || [];
                              const isSelected = currentValue.includes(
                                option?.id
                              );
                              const newValue = isSelected
                                ? currentValue.filter((v) => v !== option?.id)
                                : [...currentValue, option?.id?.toString()];
                              onChange(newValue);
                            } else {
                              onChange(option?.id?.toString());
                              setIsOpen(false);
                            }
                          }}
                        >
                          <span className="text-gray-700">{option?.label}</span>
                          {is_multiple
                            ? value?.includes(option?.id) && (
                                <FiCheck className="text-blue-500" />
                              )
                            : value === option?.id && (
                                <FiCheck className="text-blue-500" />
                              )}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-gray-500">
                        No results found
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </>
          )}
        />

        {errors[name] && (
          <p className="text-red-500 text-sm mt-1">{errors[name]?.message}</p>
        )}
      </div>
    );
  }
);

export default Select;
