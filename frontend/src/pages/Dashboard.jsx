import React from 'react';
import StatCard from '../components/StatCard';

function Dashboard() {
  // TODO: Fetch and auto-refresh analytics data
  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <h2 className="text-4xl font-bold mb-8 text-slate-800">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Revenue" value="$12,000" />
        <StatCard label="Total Orders" value="320" />
        <StatCard label="Total Users" value="150" />
        <StatCard label="Total Products" value="45" />
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
