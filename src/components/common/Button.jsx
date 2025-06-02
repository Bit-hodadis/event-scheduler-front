// src/components/common/Button.jsx
import React from "react";

const Button = ({
  children,
  variant = "primary",
  className = "",
  loading = false,
  disabled = false,
  ...props
}) => {
  const variantStyles = {
    primary: "bg-primary/90 hover:bg-primary text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    outline: "border border-primary/50 text-primary hover:bg-primary/5",
  };

  return (
    <button
      className={` 
        px-4 
        py-2 
        rounded-md 
        transition-colors 
        duration-200 
        focus:outline-none 
        focus:ring-2 
        ring-offset-2
        focus:ring-primary 
        flex 
        items-center 
        justify-center 
        ${variantStyles[variant]} 
        ${className} 
        ${loading || disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <span className="flex items-center space-x-2">
          <span className="loader" />{" "}
          {/* Replace with spinner icon if available */}
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
