import React, { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const InputField = React.forwardRef(
  (
    {
      name,
      label,
      type = "text",
      placeholder,
      frontIcon: FrontIcon,
      endIcon: EndIcon,
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const formContext = useFormContext(); // Get the form context

    // If form context is not available, render a plain input field
    if (!formContext) {
      return (
        <div className="mb-4">
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
          <div className="relative">
            {FrontIcon && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <FrontIcon size={20} />
              </div>
            )}
            <input
              type={type === "password" && showPassword ? "text" : type}
              id={name}
              ref={ref}
              placeholder={placeholder}
              className={`w-full px-3 py-2 pl-${FrontIcon ? 10 : 3} pr-${
                EndIcon || type === "password" ? 10 : 3
              } border border-primary rounded-md focus:outline-none focus:ring-[1px] focus:ring-primary`}
            />
            {type === "password" ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  <AiFillEyeInvisible size={20} />
                ) : (
                  <AiFillEye size={20} />
                )}
              </button>
            ) : EndIcon ? (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <EndIcon size={20} />
              </div>
            ) : null}
          </div>
        </div>
      );
    }

    // If form context is available, use Controller
    const {
      control,
      formState: { errors },
    } = formContext;

    return (
      <div className="mb-4">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
        <Controller
          name={name}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <div className="relative">
              {FrontIcon && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <FrontIcon size={20} />
                </div>
              )}
              <input
                {...field}
                type={type === "password" && showPassword ? "text" : type}
                id={name}
                placeholder={placeholder}
                className={`w-full px-3 py-2 pl-${FrontIcon ? 10 : 3} pr-${
                  EndIcon || type === "password" ? 10 : 3
                } border ${
                  errors[name]
                    ? "border-red-500"
                    : "border-primary focus:border-primary"
                } rounded-md  focus:outline-none focus:ring-[1px] focus:ring-primary`}
              />
              {type === "password" ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <AiFillEyeInvisible size={20} />
                  ) : (
                    <AiFillEye size={20} />
                  )}
                </button>
              ) : EndIcon ? (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <EndIcon size={20} />
                </div>
              ) : null}
            </div>
          )}
        />
        {errors[name] && (
          <p className="text-red-500 text-sm mt-1">{errors[name]?.message}</p>
        )}
      </div>
    );
  }
);

export default InputField;
