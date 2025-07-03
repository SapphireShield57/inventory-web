import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [editedQuantities, setEditedQuantities] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [totalStock, setTotalStock] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [stockHistory, setStockHistory] = useState([]);

  const navigate = useNavigate();

  const categoryMap = {
    "Fastening Tools": ["screwdriver", "screw", "riveter", "hex", "allen"],
    "Striking Tools": ["hammer", "mallet", "pry bar", "chisel"],
    "Finishing Tools": ["sanding", "sharpening", "brush", "steel file"],
  };

  const fetchProducts = () => {
    axios
      .get("https://backend-bjq5.onrender.com/inventory/product/")
      .then((response) => {
        setProducts(response.data);
        const total = response.data.reduce((acc, item) => acc + item.quantity, 0);
        setTotalStock(total);
      })
      .catch((error) => console.error("Error fetching products:", error));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleQuantityChange = (id, newQuantity) => {
    setEditedQuantities((prev) => ({
      ...prev,
      [id]: newQuantity,
    }));
  };

  const handleConfirmQuantities = () => {
    const updates = Object.entries(editedQuantities).map(([id, quantity]) =>
      axios.put(`https://backend-bjq5.onrender.com/inventory/product/id/${id}/`, {
        quantity,
      })
    );

    Promise.all(updates)
      .then(() => {
        fetchProducts();
        setEditedQuantities({});
      })
      .catch((error) => {
        console.error("Update failed:", error.response || error.message);
        alert("Failed to update quantities.");
      });
  };

  const getCategory = (name) => {
    const lower = name.toLowerCase();
    for (const [category, keywords] of Object.entries(categoryMap)) {
      if (keywords.some((kw) => lower.includes(kw))) return category;
    }
    return "Other";
  };

  const handleViewHistory = (productId) => {
    axios
      .get(`https://backend-bjq5.onrender.com/inventory/product/${productId}/history/`)
      .then((res) => {
        setStockHistory(res.data);
        setSelectedProductId(productId);
      })
      .catch((err) => {
        console.error("Failed to fetch history", err);
        alert("Could not fetch stock history.");
      });
  };

  const filteredProducts = [...products]
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMin = minPrice === "" || product.price >= parseFloat(minPrice);
      const matchesMax = maxPrice === "" || product.price <= parseFloat(maxPrice);
      const matchesCategory =
        !selectedCategory || selectedCategory === getCategory(product.name);
      return matchesSearch && matchesMin && matchesMax && matchesCategory;
    })
    .sort((a, b) => parseInt(a.qr_code) - parseInt(b.qr_code));

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-black text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-4">
          <Link to="/add-product">
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Add Product
            </button>
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="text-xl font-semibold mb-4 text-gray-700">
        Total Stocks: <span className="text-black">{totalStock}</span>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-4 mb-6">
        <input
          type="text"
          placeholder="Search by name"
          className="p-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min price"
          className="p-2 border rounded"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max price"
          className="p-2 border rounded"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <select
          className="p-2 border rounded"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Fastening Tools">Fastening Tools</option>
          <option value="Striking Tools">Striking Tools</option>
          <option value="Finishing Tools">Finishing Tools</option>
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-600">No matching products.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Description</th>
                <th className="text-left px-4 py-2">Quantity</th>
                <th className="text-left px-4 py-2">QR</th>
                <th className="text-left px-4 py-2">Price</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-t hover:bg-gray-100">
                  <td className="text-black px-4 py-2">{product.name}</td>
                  <td className="text-black px-4 py-2">{product.description}</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={editedQuantities[product.id] ?? product.quantity}
                      onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                      className="w-20 px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="text-black px-4 py-2">{product.qr_code}</td>
                  <td className="text-black px-4 py-2">P{product.price}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => navigate(`/product/id/${product.id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleViewHistory(product.id)}
                      className="text-purple-600 hover:underline"
                    >
                      History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {Object.keys(editedQuantities).length > 0 && (
            <div className="flex justify-end mt-4">
              <button
                onClick={handleConfirmQuantities}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Confirm Quantity Changes
              </button>
            </div>
          )}
        </div>
      )}

      {/* 🔍 Stock History Modal */}
      {selectedProductId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Stock History</h2>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-2">Type</th>
                  <th className="text-left py-2">Qty</th>
                  <th className="text-left py-2">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {stockHistory.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-2 text-center text-gray-500">No history yet.</td>
                  </tr>
                ) : (
                  stockHistory.map((entry) => (
                    <tr key={entry.id}>
                      <td className="py-1">{entry.change_type}</td>
                      <td className="py-1">{entry.quantity_changed}</td>
                      <td className="py-1">{new Date(entry.timestamp).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="mt-4 text-right">
              <button
                onClick={() => setSelectedProductId(null)}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
