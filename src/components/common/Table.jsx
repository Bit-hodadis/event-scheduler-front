import React, { useMemo, useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const Table = ({
  data = [],
  columns = [],
  isLoading = false,
  pagination = null,
  onSort = null,
  sortConfig = null,
  emptyMessage = 'No data available',
  rowClassName = '',
  containerClassName = '',
}) => {
  // All hooks must be called at the top level
  const [hoveredRow, setHoveredRow] = useState(null);
  
  // Memoize sort functions to prevent unnecessary re-renders
  const sortHandlers = useMemo(() => ({
    handleSort: (column) => {
      if (!onSort || !column.sortable) return;
      onSort(column.accessor);
    },
    getSortIndicator: (column) => {
      if (!sortConfig || !column.sortable) return null;
      if (sortConfig.key !== column.accessor) return null;

      return sortConfig.direction === 'asc' ? (
        <ChevronUpIcon className="h-4 w-4 inline-block ml-1" />
      ) : (
        <ChevronDownIcon className="h-4 w-4 inline-block ml-1" />
      );
    }
  }), [onSort, sortConfig]);

  // Memoize the table rows to prevent unnecessary re-renders
  const tableRows = useMemo(() => {
    if (!data || !columns) return null;
    
    return data.map((row, rowIndex) => (
      <tr
        key={row.id || rowIndex}
        className={`
          ${rowClassName}
          ${hoveredRow === rowIndex ? 'bg-gray-50' : 'bg-white'}
          transition-colors duration-150 ease-in-out
        `}
        onMouseEnter={() => setHoveredRow(rowIndex)}
        onMouseLeave={() => setHoveredRow(null)}
      >
        {columns.map((column, colIndex) => {
          const value = row[column.accessor];
          return (
            <td
              key={colIndex}
              className={`px-6 py-4 whitespace-nowrap ${column.className || ''}`}
            >
              {column.cell ? column.cell({ value, row: { original: row } }) : value}
            </td>
          );
        })}
      </tr>
    ));
  }, [data, columns, hoveredRow, rowClassName]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className={`overflow-x-auto ${containerClassName}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-primary-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-primary-900 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {[...Array(3)].map((_, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-12 bg-white rounded-lg">
      <p className="text-gray-500">{emptyMessage}</p>
    </div>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!data.length) {
    return <EmptyState />;
  }

  return (
    <div className={`overflow-x-auto ${containerClassName}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-primary-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-6 py-3 text-left text-xs font-medium text-primary-900 uppercase tracking-wider ${
                  column.sortable ? 'cursor-pointer select-none' : ''
                }`}
                onClick={() => sortHandlers.handleSort(column)}
              >
                <span className="flex items-center">
                  {column.header}
                  {sortHandlers.getSortIndicator(column)}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tableRows}
        </tbody>
      </table>

      {pagination && (
        <div className="py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Previous
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={
                pagination.currentPage ===
                Math.ceil(pagination.totalItems / pagination.pageSize)
              }
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {(pagination.currentPage - 1) * pagination.pageSize + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(
                    pagination.currentPage * pagination.pageSize,
                    pagination.totalItems
                  )}
                </span>{' '}
                of <span className="font-medium">{pagination.totalItems}</span>{' '}
                results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => pagination.onPageChange(1)}
                  disabled={pagination.currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <span className="sr-only">First</span>
                  <ChevronDownIcon className="h-5 w-5 rotate-90" />
                  <ChevronDownIcon className="h-5 w-5 -ml-2 rotate-90" />
                </button>
                <button
                  onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronDownIcon className="h-5 w-5 rotate-90" />
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  Page {pagination.currentPage}
                </span>
                <button
                  onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                  disabled={
                    pagination.currentPage ===
                    Math.ceil(pagination.totalItems / pagination.pageSize)
                  }
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <span className="sr-only">Next</span>
                  <ChevronDownIcon className="h-5 w-5 -rotate-90" />
                </button>
                <button
                  onClick={() =>
                    pagination.onPageChange(
                      Math.ceil(pagination.totalItems / pagination.pageSize)
                    )
                  }
                  disabled={
                    pagination.currentPage ===
                    Math.ceil(pagination.totalItems / pagination.pageSize)
                  }
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <span className="sr-only">Last</span>
                  <ChevronDownIcon className="h-5 w-5 -rotate-90" />
                  <ChevronDownIcon className="h-5 w-5 -ml-2 -rotate-90" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
