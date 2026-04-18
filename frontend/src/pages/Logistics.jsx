import React from 'react';

function Logistics() {
  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <h2 className="text-4xl font-bold mb-8 text-slate-800">Logistics Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Shipments Today</h3>
          <p className="text-3xl font-bold text-blue-600">3,420</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">On-Time Delivery</h3>
          <p className="text-3xl font-bold text-green-600">97.2%</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Fleet Utilization</h3>
          <p className="text-3xl font-bold text-purple-600">89.3%</p>
        </div>
      </div>
    </div>
  );
}

export default Logistics;
