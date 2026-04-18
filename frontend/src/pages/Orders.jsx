import React from 'react';

function Orders() {
  // TODO: Fetch and display orders, add order form, status dropdown
  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <h2 className="text-4xl font-bold mb-8 text-slate-800">Orders Management</h2>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        {/* Order Form */}
        <form className="flex flex-col md:flex-row gap-4 items-end">
          <input className="flex-1 md:flex-none border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="User ID" />
          <input className="flex-1 md:flex-none border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Product ID" />
          <input className="flex-1 md:flex-none border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Quantity" type="number" />
          <input className="flex-1 md:flex-none border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Payment Method" />
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 font-semibold transition-all">Add Order</button>
        </form>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 overflow-hidden">
        {/* DataTable for orders */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200">
                <th className="p-4 text-left font-semibold text-slate-700">Order ID</th>
                <th className="p-4 text-left font-semibold text-slate-700">Customer Name</th>
                <th className="p-4 text-left font-semibold text-slate-700">Date</th>
                <th className="p-4 text-left font-semibold text-slate-700">Status</th>
                <th className="p-4 text-left font-semibold text-slate-700">Total Amount</th>
                <th className="p-4 text-left font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Order rows go here */}
              <tr className="border-b border-slate-100 hover:bg-blue-50 transition-colors">
                <td className="p-4 text-slate-800">1</td>
                <td className="p-4 text-slate-800">John Doe</td>
                <td className="p-4 text-slate-800">2026-04-19</td>
                <td className="p-4">
                  <select className="border border-slate-300 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option>Pending</option>
                    <option>Completed</option>
                  </select>
                </td>
                <td className="p-4 text-slate-800 font-semibold">$100</td>
                <td className="p-4"><button className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">Update</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Orders;
