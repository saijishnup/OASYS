import React from 'react';

function ChartWrapper({ children, title }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 hover:shadow-xl transition-shadow">
      <h3 className="font-bold text-lg mb-4 text-slate-800">{title}</h3>
      <div className="min-h-[300px]">{children}</div>
    </div>
  );
}

export default ChartWrapper;
