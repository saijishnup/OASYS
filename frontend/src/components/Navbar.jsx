import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ onLogout }) {
  return (
    <nav className="flex items-center justify-between bg-blue-600 px-6 py-3 shadow text-white">
      <div className="flex gap-4">
        <Link className="hover:text-blue-200 font-semibold" to="/dashboard">Dashboard</Link>
        <Link className="hover:text-blue-200 font-semibold" to="/orders">Orders</Link>
        <Link className="hover:text-blue-200 font-semibold" to="/products">Products</Link>
        <Link className="hover:text-blue-200 font-semibold" to="/users">Users</Link>
        <Link className="hover:text-blue-200 font-semibold" to="/segments">Segments</Link>
        <Link className="hover:text-blue-200 font-semibold" to="/logs">Logs</Link>
        <Link className="hover:text-blue-200 font-semibold" to="/monthly-report">Monthly Report</Link>
      </div>
      <button
        onClick={onLogout}
        className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-blue-100 font-bold"
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
