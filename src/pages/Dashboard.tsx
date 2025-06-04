import React from 'react';
import { format } from 'date-fns';
import { mockEvents } from '../mocks/sampleEvents';
import { useGetCategoriesQuery } from '../services/category.service';

// Calculate event statistics
const getEventStats = () => {
  const events = mockEvents;
  const total = events.length;
  const upcoming = events.filter(e => new Date(e.startDate) > new Date()).length;
  const past = total - upcoming;

  // Group by category
  const categories = events.reduce((acc, event) => {
    const category = event.category || 'Other';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return { total, upcoming, past, categories };
};

const StatCard: React.FC<{ title: string; value: number | string; color: string }> = ({ 
  title, 
  value, 
  color 
}) => (
  <div className={`p-6 rounded-xl border border-primary-500 ${color}`}>
    <h3 className="text-lg font-medium text-gray-700">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

const CategoryCard: React.FC<{ category: string; count: number }> = ({ category, count }) => (
  <div className="p-4 bg-white rounded-lg border border-primary-500">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-600">{category}</span>
      <span className="text-lg font-semibold text-gray-900">{count}</span>
    </div>
  </div>
);

export const Dashboard = () => {
  const stats = getEventStats();
  const {data:category} = useGetCategoriesQuery()
 const total_event = category?.reduce((acc, cat) => acc + cat.total_count, 0);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-xl border border-primary-500">
        <h1 className="text-2xl font-bold text-gray-900">Welcome to Your Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Here&apos;s what&apos;s happening with your events as of {format(new Date(), "MMMM d, yyyy")}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1  gap-6">
        <StatCard
          title="Total Events"
          value={total_event}
          color="bg-blue-50"
        />
  
      </div>

      {/* Categories Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Events by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {category?.map((cat) => (
            <CategoryCard key={cat.id} category={cat.name} count={cat.total_count} />
          ))}
        </div>
      </div>
    </div>
  );
};
