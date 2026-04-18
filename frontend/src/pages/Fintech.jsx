import React from 'react';

function Fintech() {
  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <h2 className="text-4xl font-bold mb-8 text-slate-800">Fintech Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Transaction Volume</h3>
          <p className="text-3xl font-bold text-blue-600">$2.5M</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Active Users</h3>
          <p className="text-3xl font-bold text-green-600">15.2K</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Success Rate</h3>
          <p className="text-3xl font-bold text-purple-600">99.8%</p>
        </div>
      </div>
    </div>
  );
}

export default Fintech;
