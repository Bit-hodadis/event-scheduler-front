import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import DataLabels plugin

ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

const PieChart = ({ data,title }) => {
  // Ensure the data prop has the required structure
  if (!data || !data?.monthly_totals || data?.monthly_totals?.length === 0) {
    return <div>No data available</div>;
  }

  // Generate labels and data dynamically from the passed-in props
  const labels = data?.monthly_totals?.map((entry) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[entry.month - 1]; // Get month name based on month number
  });

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Total Amount per Month',
        data: data?.monthly_totals?.map(entry => entry.total_amount),
        backgroundColor: [
          '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FF9133',
          '#57FF33', '#FF5733', '#33A1FF', '#A133FF', '#FF5733', '#FF33FF'
        ],
        hoverOffset: 4,
      },
    ],
  };

  // Options for the Pie chart
  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `ETB${tooltipItem.raw.toLocaleString()}`;
          },
        },
      },
      datalabels: {
        color: 'white',  // Color of the label
        font: {
          weight: 'bold',
        },
        formatter: function(value) {
          return `ETB${value.toLocaleString()}`;  // Format the label to show currency
        },
      },
    },
  };

  return (
    <div className="p-4 bg-white  rounded-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">{title}</h2>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChart;
