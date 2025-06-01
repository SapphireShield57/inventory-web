import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    quantity: '',
    qr_code: '',
  });

  useEffect(() => {
    axios
      .get(`https://backend-bjq5.onrender.com/inventory/product/id/${id}/`)
      .then((res) => {
        setProduct(res.data);
        setForm({
          name: res.data.name,
          price: res.data.price,
          description: res.data.description,
          quantity: res.data.quantity,
          qr_code: res.data.qr_code,
        });
      })
      .catch((err) => {
        console.error('Error fetching product:', err);
        navigate('/dashboard');
        console.error('Update failed:', err);
        alert("Update failed: " + (err.response?.data?.detail || err.message));
      });
  }, [id, navigate]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      axios
        .delete(`https://backend-bjq5.onrender.com/inventory/product/id/${id}/`)
        .then(() => {
          navigate('/dashboard');
        })
        .catch((err) => console.error('Delete failed:', err));
    }
  };

  const handleUpdate = () => {
    axios
      .put(`https://backend-bjq5.onrender.com/inventory/product/id/${id}/`, {
        ...form,
        price: parseFloat(form.price),
      })
      .then((res) => {
        setProduct(res.data);
        setIsEditing(false);
      })
      .catch((err) => console.error('Update failed:', err));
  };

  const handleCancelEdit = () => {
    if (window.confirm('Discard changes?')) {
      setForm({
        name: product.name,
        price: product.price,
        description: product.description,
      });
      setIsEditing(false);
    }
  };

  if (!product) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md p-6 mt-8 rounded-xl">
      <h1 className="text-black text-2xl font-bold mb-6 text-center">Product Details</h1>

      <div className="space-y-4">
        <div>
          <label className="text-black font-semibold block mb-1">Name</label>
          {isEditing ? (
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border rounded p-2 w-full"
            />
          ) : (
            <p className="text-black text-lg">{product.name}</p>
          )}
        </div>

        <div>
          <label className="text-black font-semibold block mb-1">Price</label>
          {isEditing ? (
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="border rounded p-2 w-full"
            />
          ) : (
            <p className="text-black text-lg">₱{product.price}</p>
          )}
        </div>

        <div>
          <label className="text-black font-semibold block mb-1">Description</label>
          {isEditing ? (
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="border rounded p-2 w-full"
            />
          ) : (
            <p className="text-black">{product.description}</p>
          )}
        </div>

        <div className="text-sm text-gray-500">
          <strong>QR Code:</strong> {product.qr_code || 'N/A'}
        </div>

        <div className="flex flex-wrap gap-4 mt-6">
          {isEditing ? (
            <>
              <button
                onClick={handleUpdate}
                disabled={!form.name || !form.price}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Edit
            </button>
          )}

          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 ml-auto"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
