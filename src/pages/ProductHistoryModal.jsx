import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProductHistoryModal({ qrCode, onClose }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get(`https://backend-bjq5.onrender.com/inventory/product/${qrCode}/history/`)
      .then(res => setHistory(res.data))
      .catch(err => console.error(err));
  }, [qrCode]);

  return (
    <div className="modal text-black font-bold p-4 bg-white rounded shadow-md">
      <h2 className="text-xl mb-2">Stock History</h2>
      <button className="mb-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-black" onClick={onClose}>
        Close
      </button>
      <table className="w-full text-black border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Type</th>
            <th className="border px-2 py-1">Quantity</th>
            <th className="border px-2 py-1">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {history.map(item => (
            <tr key={item.id}>
              <td className="border px-2 py-1">{item.change_type}</td>
              <td className="border px-2 py-1">{item.quantity_changed}</td>
              <td className="border px-2 py-1">{new Date(item.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductHistoryModal;
