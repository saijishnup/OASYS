import React from 'react';

function Segments() {
  // TODO: Fetch and display customer segments, color-code rows
  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <h2 className="text-4xl font-bold mb-8 text-slate-800">Customer Segments</h2>
      <div className="bg-white rounded-xl shadow-lg p-6 overflow-hidden">
        {/* DataTable for segments */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200">
                <th className="p-4 text-left font-semibold text-slate-700">User ID</th>
                <th className="p-4 text-left font-semibold text-slate-700">Name</th>
                <th className="p-4 text-left font-semibold text-slate-700">Total Orders</th>
                <th className="p-4 text-left font-semibold text-slate-700">Total Spent</th>
                <th className="p-4 text-left font-semibold text-slate-700">Segment</th>
              </tr>
            </thead>
            <tbody>
              {/* Example color-coded rows */}
              <tr className="bg-emerald-50 border-b border-slate-100 hover:bg-emerald-100 transition-colors">
                <td className="p-4 text-slate-800">1</td>
                <td className="p-4 text-slate-800 font-semibold">Alice</td>
                <td className="p-4 text-slate-800">12</td>
                <td className="p-4 text-slate-800 font-semibold text-green-600">$1200</td>
                <td className="p-4"><span className="bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">High-Value</span></td>
              </tr>
              <tr className="bg-amber-50 border-b border-slate-100 hover:bg-amber-100 transition-colors">
                <td className="p-4 text-slate-800">2</td>
                <td className="p-4 text-slate-800 font-semibold">Bob</td>
                <td className="p-4 text-slate-800">8</td>
                <td className="p-4 text-slate-800 font-semibold text-orange-600">$800</td>
                <td className="p-4"><span className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold">Frequent</span></td>
              </tr>
              <tr className="bg-slate-50 border-b border-slate-100 hover:bg-slate-100 transition-colors">
                <td className="p-4 text-slate-800">3</td>
                <td className="p-4 text-slate-800 font-semibold">Charlie</td>
                <td className="p-4 text-slate-800">3</td>
                <td className="p-4 text-slate-800 font-semibold text-slate-600">$200</td>
                <td className="p-4"><span className="bg-slate-300 text-slate-800 px-3 py-1 rounded-full text-xs font-semibold">Occasional</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Segments;
