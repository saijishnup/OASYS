import React from 'react';

function LineChart({ data, title }) {
  // TODO: Implement chart with a library like Chart.js or Recharts
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <h4 className="text-lg font-bold text-slate-800 mb-4">{title}</h4>
      <div className="w-full h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center text-slate-400">
        {/* Chart placeholder - Replace with actual chart library */}
        <p className="text-sm">Chart visualization will appear here</p>
      </div>
    </div>
  );
}

export default LineChart;
