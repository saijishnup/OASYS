import React from 'react';

function Logs() {
  // TODO: Fetch and display logs, auto-refresh
  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <h2 className="text-4xl font-bold mb-8 text-slate-800">Audit Logs</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center gap-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <span className="text-sm text-blue-700 font-medium">Auto-refreshes every 10 seconds</span>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 overflow-hidden">
        {/* DataTable for logs */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200">
                <th className="p-4 text-left font-semibold text-slate-700">Log ID</th>
                <th className="p-4 text-left font-semibold text-slate-700">Action</th>
                <th className="p-4 text-left font-semibold text-slate-700">Table Name</th>
                <th className="p-4 text-left font-semibold text-slate-700">Record ID</th>
                <th className="p-4 text-left font-semibold text-slate-700">Description</th>
                <th className="p-4 text-left font-semibold text-slate-700">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {/* Log rows go here */}
              <tr className="border-b border-slate-100 hover:bg-blue-50 transition-colors">
                <td className="p-4 text-slate-800">1</td>
                <td className="p-4"><span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-semibold">UPDATE</span></td>
                <td className="p-4 text-slate-800">Orders</td>
                <td className="p-4 text-slate-800">101</td>
                <td className="p-4 text-slate-800">Order status changed</td>
                <td className="p-4 text-slate-600 text-xs">2026-04-19 10:00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Logs;
