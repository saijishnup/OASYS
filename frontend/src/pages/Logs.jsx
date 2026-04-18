import React from 'react';

function Logs() {
  // TODO: Fetch and display logs, auto-refresh
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Logs</h2>
      <div className="bg-white rounded shadow p-4 mb-2">
        <span className="text-xs text-gray-500">Auto-refreshes every 10 seconds</span>
      </div>
      <div className="bg-white rounded shadow p-4">
        {/* DataTable for logs */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Log ID</th>
                <th className="p-2">Action</th>
                <th className="p-2">Table Name</th>
                <th className="p-2">Record ID</th>
                <th className="p-2">Description</th>
                <th className="p-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {/* Log rows go here */}
              <tr>
                <td className="p-2">1</td>
                <td className="p-2">UPDATE</td>
                <td className="p-2">Orders</td>
                <td className="p-2">101</td>
                <td className="p-2">Order status changed</td>
                <td className="p-2">2026-04-19 10:00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Logs;
