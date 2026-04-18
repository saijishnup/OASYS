import React from 'react';

function Users() {
  // TODO: Fetch and display users, add user form
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Users</h2>
      <div className="bg-white rounded shadow p-4 mb-6">
        {/* Add User Form */}
        <form className="flex flex-col md:flex-row gap-4 items-end">
          <input className="border px-3 py-2 rounded w-full md:w-40" placeholder="User Name" />
          <input className="border px-3 py-2 rounded w-full md:w-40" placeholder="Email" />
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-semibold">Add User</button>
        </form>
      </div>
      <div className="bg-white rounded shadow p-4">
        {/* DataTable for users */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">User ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* User rows go here */}
              <tr>
                <td className="p-2">1</td>
                <td className="p-2">Alice</td>
                <td className="p-2">alice@email.com</td>
                <td className="p-2"><button className="text-blue-600">Edit</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Users;
