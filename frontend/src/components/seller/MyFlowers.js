import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function MyFlowers() {
  const [flowers, setFlowers] = useState([]);

  const fetchFlowers = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/seller/my-flowers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlowers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteFlower = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/seller/delete-flower/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlowers(flowers.filter(f => f._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFlowers();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Flowers</h2>
      <div className="grid gap-4">
        {flowers.map(f => (
          <div key={f._id} className="border p-4 rounded shadow">
            <img src={`http://localhost:5000/${f.image}`} alt={f.name} className="h-32 object-cover mb-2" />
            <p><strong>{f.name}</strong></p>
            <p>Color: {f.color}</p>
            <p>Price: ₹{f.price}</p>
            <button onClick={() => deleteFlower(f._id)} className="mt-2 bg-red-500 text-white p-1 rounded">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
