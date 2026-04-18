import React from 'react';

function Automobiles() {
  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <h2 className="text-4xl font-bold mb-8 text-slate-800">Automobiles Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Vehicles in Fleet</h3>
          <p className="text-3xl font-bold text-blue-600">2,845</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Fuel Efficiency</h3>
          <p className="text-3xl font-bold text-green-600">24.5 MPG</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Maintenance Issues</h3>
          <p className="text-3xl font-bold text-purple-600">42</p>
        </div>
      </div>
    </div>
  );
}

export default Automobiles;
