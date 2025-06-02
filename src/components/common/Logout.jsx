import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { useLogoutMutation } from "../../store/services/authApi";

const Logout = ({ className = "", onLogout, noStyle }) => {
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const handleLogout = async () => {
    try {
      // Clear any authentication tokens
      await logout();
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("userSession");
      localStorage.clear();
      // Call any additional logout logic passed as prop
      if (onLogout) {
        await onLogout();
      }

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally show an error toast or message
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`flex items-center ${
        noStyle
          ? ""
          : `
      justify-center 
      px-4 py-2 
      bg-red-500 hover:bg-red-600 
      text-white 
      rounded-md 
      transition-colors 
      duration-200 
      focus:outline-none 
      focus:ring-2 
      focus:ring-red-300 
      ${className}
    `
      }`}
    >
      <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
      <span>Logout</span>
    </button>
  );
};

export default Logout;
