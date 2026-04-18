import React from 'react';

function Products() {
  // TODO: Fetch and display products, add product form, inline stock update
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Products</h2>
      <div className="bg-white rounded shadow p-4 mb-6">
        {/* Add Product Form */}
        <form className="flex flex-col md:flex-row gap-4 items-end">
          <input className="border px-3 py-2 rounded w-full md:w-40" placeholder="Product Name" />
          <input className="border px-3 py-2 rounded w-full md:w-40" placeholder="Category" />
          <input className="border px-3 py-2 rounded w-full md:w-32" placeholder="Price" type="number" />
          <input className="border px-3 py-2 rounded w-full md:w-32" placeholder="Stock" type="number" />
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-semibold">Add Product</button>
        </form>
      </div>
      <div className="bg-white rounded shadow p-4">
        {/* DataTable for products */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Product ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Category</th>
                <th className="p-2">Price</th>
                <th className="p-2">Stock</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Product rows go here */}
              <tr>
                <td className="p-2">1</td>
                <td className="p-2">Product A</td>
                <td className="p-2">Category X</td>
                <td className="p-2">$50</td>
                <td className="p-2">
                  <input className="border rounded px-2 py-1 w-16" type="number" defaultValue={10} />
                </td>
                <td className="p-2"><button className="text-blue-600">Update</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Products;
