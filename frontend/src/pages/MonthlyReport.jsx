import React from 'react';

function MonthlyReport() {
  // TODO: Month/year dropdowns, fetch report, display tables
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Monthly Report</h2>
      <form className="flex flex-col md:flex-row gap-4 mb-6">
        <select className="border px-3 py-2 rounded w-full md:w-40">
          <option>January</option>
          <option>February</option>
          <option>March</option>
          {/* ...other months... */}
        </select>
        <select className="border px-3 py-2 rounded w-full md:w-32">
          <option>2026</option>
          <option>2025</option>
        </select>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-semibold">Get Report</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded shadow p-4">Total Revenue: $5000</div>
        <div className="bg-white rounded shadow p-4">Total Orders: 120</div>
        <div className="bg-white rounded shadow p-4">Top 5 Products</div>
      </div>
      <div className="bg-white rounded shadow p-4 mb-6">
        <h3 className="font-semibold mb-2">Top 5 Products</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Product</th>
                <th className="p-2">Sales</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">Product A</td>
                <td className="p-2">$1000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-2">Top 5 Customers</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Customer</th>
                <th className="p-2">Orders</th>
                <th className="p-2">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">Alice</td>
                <td className="p-2">10</td>
                <td className="p-2">$1200</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MonthlyReport;
