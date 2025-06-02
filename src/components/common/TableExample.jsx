import React, { useState } from 'react';
import Table from './Table';

const TableExample = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // Example data
  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
    // ... more data
  ];

  // Column definitions
  const columns = [
    {
      header: 'Name',
      accessor: 'name',
      sortable: true,
    },
    {
      header: 'Email',
      accessor: 'email',
      sortable: true,
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      cell: ({ value }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === 'Active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <button
          onClick={() => alert(`Edit ${row.original.name}`)}
          className="text-primary hover:text-primary-dark"
        >
          Edit
        </button>
      ),
    },
  ];

  // Sort handler
  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    }));
  };

  // Sort the data
  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (sortConfig.direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Table Example</h2>
      
      <Table
        data={sortedData}
        columns={columns}
        isLoading={false}
        onSort={handleSort}
        sortConfig={sortConfig}
        pagination={{
          currentPage,
          pageSize: 10,
          totalItems: data.length,
          onPageChange: setCurrentPage,
        }}
        emptyMessage="No users found"
        containerClassName="mt-4"
      />

      <div className="mt-4">
        <h3 className="font-bold mb-2">Features demonstrated:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Sortable columns (click on Name, Email, or Status headers)</li>
          <li>Custom cell rendering (Status column with badges)</li>
          <li>Custom action column</li>
          <li>Pagination with first/last page buttons</li>
          <li>Loading state (set isLoading prop to true)</li>
          <li>Empty state message</li>
          <li>Row hover effect</li>
          <li>Responsive design</li>
        </ul>
      </div>
    </div>
  );
};

export default TableExample;
