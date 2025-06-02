import React from "react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

const   Pagination = ({ totalPages, activePage, onPageChange })=> {
  const getItemProps = (index) => ({
    className: `px-3 py-1 rounded-md ${
      activePage === index
        ? "bg-primary text-white"
        : "bg-white text-gray-700 hover:bg-gray-200"
    }`,
    onClick: () => onPageChange(index),
  });

  const next = () => {
    if (activePage === totalPages) return;
    onPageChange(activePage + 1);
  };

  const prev = () => {
    if (activePage === 1) return;
    onPageChange(activePage - 1);
  };

  // Generate page numbers based on totalPages and activePage
  const getPageNumbers = () => {
    const range = [];
    const showRange = 2; // Number of neighbors to show around the active page

    if (totalPages <= 7) {
      // Show all page numbers if total pages are small
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      // Always show first, last, active, and a few neighbors
      range.push(1); // First page

      if (activePage > showRange + 2) range.push("..."); // Left ellipsis

      for (
        let i = Math.max(2, activePage - showRange);
        i <= Math.min(totalPages - 1, activePage + showRange);
        i++
      ) {
        range.push(i);
      }

      if (activePage < totalPages - showRange - 1) range.push("..."); // Right ellipsis

      range.push(totalPages); // Last page
    }

    return range;
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <button
        onClick={prev}
        disabled={activePage === 1}
        className={`flex items-center gap-2 px-4 py-2 rounded-md border text-gray-700 ${
          activePage === 1
            ? "cursor-not-allowed bg-gray-200"
            : "hover:bg-gray-100"
        }`}
      >
        <FaArrowLeft className="h-4 w-4" /> Previous
      </button>
      <div className="flex items-center gap-2">
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={index} className="px-2 text-gray-500">
              ...
            </span>
          ) : (
            <button key={index} {...getItemProps(page)}>
              {page}
            </button>
          )
        )}
      </div>
      <button
        onClick={next}
        disabled={activePage === totalPages}
        className={`flex items-center gap-2 px-4 py-2 rounded-md border text-gray-700 ${
          activePage === totalPages
            ? "cursor-not-allowed bg-gray-200"
            : "hover:bg-gray-100"
        }`}
      >
        Next <FaArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}


export default Pagination