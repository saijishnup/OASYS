import React from 'react';

function Telecom() {
  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <h2 className="text-4xl font-bold mb-8 text-slate-800">Telecom Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Total Subscribers</h3>
          <p className="text-3xl font-bold text-blue-600">8.9M</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Revenue</h3>
          <p className="text-3xl font-bold text-green-600">$125M</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Network Coverage</h3>
          <p className="text-3xl font-bold text-purple-600">98.5%</p>
        </div>
      </div>
    </div>
  );
}

export default Telecom;
