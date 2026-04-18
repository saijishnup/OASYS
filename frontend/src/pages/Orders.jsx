import React from 'react';

function Orders() {
  // TODO: Fetch and display orders, add order form, status dropdown
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Orders</h2>
      <div className="bg-white rounded shadow p-4 mb-6">
        {/* Order Form */}
        <form className="flex flex-col md:flex-row gap-4 items-end">
          <input className="border px-3 py-2 rounded w-full md:w-40" placeholder="User ID" />
          <input className="border px-3 py-2 rounded w-full md:w-40" placeholder="Product ID" />
          <input className="border px-3 py-2 rounded w-full md:w-32" placeholder="Quantity" type="number" />
          <input className="border px-3 py-2 rounded w-full md:w-48" placeholder="Payment Method" />
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-semibold">Add Order</button>
        </form>
      </div>
      <div className="bg-white rounded shadow p-4">
        {/* DataTable for orders */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Order ID</th>
                <th className="p-2">Customer Name</th>
                <th className="p-2">Date</th>
                <th className="p-2">Status</th>
                <th className="p-2">Total Amount</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Order rows go here */}
              <tr>
                <td className="p-2">1</td>
                <td className="p-2">John Doe</td>
                <td className="p-2">2026-04-19</td>
                <td className="p-2">
                  <select className="border rounded px-2 py-1">
                    <option>Pending</option>
                    <option>Completed</option>
                  </select>
                </td>
                <td className="p-2">$100</td>
                <td className="p-2"><button className="text-blue-600">Update</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Orders;
