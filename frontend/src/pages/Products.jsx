import React from 'react';

function Products() {
  // TODO: Fetch and display products, add product form, inline stock update
  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <h2 className="text-4xl font-bold mb-8 text-slate-800">Products Management</h2>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        {/* Add Product Form */}
        <form className="flex flex-col md:flex-row gap-4 items-end">
          <input className="flex-1 border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Product Name" />
          <input className="flex-1 border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Category" />
          <input className="flex-1 border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Price" type="number" />
          <input className="flex-1 border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Stock" type="number" />
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 font-semibold transition-all">Add Product</button>
        </form>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 overflow-hidden">
        {/* DataTable for products */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200">
                <th className="p-4 text-left font-semibold text-slate-700">Product ID</th>
                <th className="p-4 text-left font-semibold text-slate-700">Name</th>
                <th className="p-4 text-left font-semibold text-slate-700">Category</th>
                <th className="p-4 text-left font-semibold text-slate-700">Price</th>
                <th className="p-4 text-left font-semibold text-slate-700">Stock</th>
                <th className="p-4 text-left font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Product rows go here */}
              <tr className="border-b border-slate-100 hover:bg-blue-50 transition-colors">
                <td className="p-4 text-slate-800">1</td>
                <td className="p-4 text-slate-800 font-semibold">Product A</td>
                <td className="p-4 text-slate-800">Category X</td>
                <td className="p-4 text-slate-800 font-semibold text-green-600">$50</td>
                <td className="p-4">
                  <input className="border border-slate-300 rounded-lg px-2 py-1 w-16 focus:outline-none focus:ring-2 focus:ring-blue-400" type="number" defaultValue={10} />
                </td>
                <td className="p-4"><button className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">Update</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Products;
