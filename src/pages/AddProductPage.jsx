// src/pages/AddProductPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddProductPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    quantity: '',
    qr_code: '',
    price: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://backend-bjq5.onrender.com/inventory/product/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/dashboard');
      } else {
        setError(data.detail || 'Error adding product');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-3xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-black">Add Product</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring"
            value={form.quantity}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="qr_code"
            placeholder="QR Code"
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring"
            value={form.qr_code}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            step="0.01"
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>

        <textarea
          name="description"
          placeholder="Description"
          rows={4}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
          value={form.description}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          {loading ? 'Saving...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;
