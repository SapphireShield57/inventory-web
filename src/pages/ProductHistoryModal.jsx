import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProductHistoryModal({ productId, onClose }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get(`https://backend-bjq5.onrender.com/inventory/product/${productId}/history/`)
      .then(res => setHistory(res.data))
      .catch(err => console.error(err));
  }, [productId]);

  return (
    <div className="modal">
      <h2>Stock History</h2>
      <button onClick={onClose}>Close</button>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Quantity</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {history.map(item => (
            <tr key={item.id}>
              <td>{item.change_type}</td>
              <td>{item.quantity_changed}</td>
              <td>{new Date(item.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductHistoryModal;
