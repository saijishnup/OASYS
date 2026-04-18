import React from 'react';

function RealEstate() {
  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <h2 className="text-4xl font-bold mb-8 text-slate-800">Real Estate Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Total Properties</h3>
          <p className="text-3xl font-bold text-blue-600">1,245</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Market Value</h3>
          <p className="text-3xl font-bold text-green-600">$450M</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Avg Price/Sqft</h3>
          <p className="text-3xl font-bold text-purple-600">$1,280</p>
        </div>
      </div>
    </div>
  );
}

export default RealEstate;
