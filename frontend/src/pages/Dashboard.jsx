import React from 'react';

function Dashboard() {
  // TODO: Fetch and auto-refresh analytics data
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* StatCards */}
        <div className="bg-white rounded shadow p-4">StatCard 1</div>
        <div className="bg-white rounded shadow p-4">StatCard 2</div>
        <div className="bg-white rounded shadow p-4">StatCard 3</div>
        <div className="bg-white rounded shadow p-4">StatCard 4</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded shadow p-4">LineChart 1</div>
        <div className="bg-white rounded shadow p-4">LineChart 2</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-4">BarChart 1</div>
        <div className="bg-white rounded shadow p-4">BarChart 2</div>
      </div>
    </div>
  );
}

export default Dashboard;
