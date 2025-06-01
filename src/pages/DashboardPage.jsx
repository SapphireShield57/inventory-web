import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('https://backend-bjq5.onrender.com/inventory/product/')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMin = minPrice === '' || product.price >= parseFloat(minPrice);
    const matchesMax = maxPrice === '' || product.price <= parseFloat(maxPrice);
    return matchesSearch && matchesMin && matchesMax;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
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

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-6">
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
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-600">No matching products.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate(`/product/id/${product.id}`)} // FIXED ID
            >
              <h2 className="text-black text-xl font-semibold mb-1">{product.name}</h2>
              <p className="text-sm text-gray-700">Price: P{product.price}</p>
              <p className="text-sm text-gray-600 truncate">{product.description}</p>
              <p className="text-xs text-gray-400 mt-1">Code: {product.qr_code}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
