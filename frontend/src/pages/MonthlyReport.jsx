import React from 'react';

function MonthlyReport() {
  // TODO: Month/year dropdowns, fetch report, display tables
  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <h2 className="text-4xl font-bold mb-8 text-slate-800">Monthly Report</h2>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <form className="flex flex-col md:flex-row gap-4 items-end">
          <select className="flex-1 border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option>January</option>
            <option>February</option>
            <option>March</option>
            <option>April</option>
            <option>May</option>
            <option>June</option>
          </select>
          <select className="flex-1 border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option>2026</option>
            <option>2025</option>
            <option>2024</option>
          </select>
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 font-semibold transition-all">Get Report</button>
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <p className="text-slate-600 text-sm font-medium mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-blue-600">$5,000</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <p className="text-slate-600 text-sm font-medium mb-2">Total Orders</p>
          <p className="text-3xl font-bold text-green-600">120</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <p className="text-slate-600 text-sm font-medium mb-2">Avg Order Value</p>
          <p className="text-3xl font-bold text-purple-600">$41.67</p>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 overflow-hidden">
        <h3 className="text-xl font-bold mb-4 text-slate-800">Top 5 Products</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200">
                <th className="p-4 text-left font-semibold text-slate-700">Product</th>
                <th className="p-4 text-left font-semibold text-slate-700">Sales</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 hover:bg-blue-50 transition-colors">
                <td className="p-4 text-slate-800 font-medium">Product A</td>
                <td className="p-4 text-slate-800 font-bold text-green-600">$1,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 overflow-hidden">
        <h3 className="text-xl font-bold mb-4 text-slate-800">Top 5 Customers</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200">
                <th className="p-4 text-left font-semibold text-slate-700">Customer</th>
                <th className="p-4 text-left font-semibold text-slate-700">Orders</th>
                <th className="p-4 text-left font-semibold text-slate-700">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 hover:bg-blue-50 transition-colors">
                <td className="p-4 text-slate-800 font-medium">Alice</td>
                <td className="p-4 text-slate-800">10</td>
                <td className="p-4 text-slate-800 font-bold text-green-600">$1,200</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MonthlyReport;
