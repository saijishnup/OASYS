import React from 'react';

function Segments() {
  // TODO: Fetch and display customer segments, color-code rows
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Customer Segments</h2>
      <div className="bg-white rounded shadow p-4">
        {/* DataTable for segments */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">User ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Total Orders</th>
                <th className="p-2">Total Spent</th>
                <th className="p-2">Segment</th>
              </tr>
            </thead>
            <tbody>
              {/* Example color-coded rows */}
              <tr className="bg-green-100">
                <td className="p-2">1</td>
                <td className="p-2">Alice</td>
                <td className="p-2">12</td>
                <td className="p-2">$1200</td>
                <td className="p-2">High-Value</td>
              </tr>
              <tr className="bg-yellow-100">
                <td className="p-2">2</td>
                <td className="p-2">Bob</td>
                <td className="p-2">8</td>
                <td className="p-2">$800</td>
                <td className="p-2">Frequent</td>
              </tr>
              <tr className="bg-gray-100">
                <td className="p-2">3</td>
                <td className="p-2">Charlie</td>
                <td className="p-2">3</td>
                <td className="p-2">$200</td>
                <td className="p-2">Occasional</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Segments;
