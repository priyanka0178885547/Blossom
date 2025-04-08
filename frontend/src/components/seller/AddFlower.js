import React, { useState } from 'react';
import axios from 'axios';

export default function AddFlower() {
  const [flower, setFlower] = useState({
    name: '',
    color: '',
    price: '',
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFlower({ ...flower, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', flower.name);
    formData.append('color', flower.color);
    formData.append('price', flower.price);
    formData.append('image', image);

    try {
      await axios.post('http://localhost:5000/api/seller/add-flower', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Flower added!');
      setFlower({ name: '', color: '', price: '' });
      setImage(null);
    } catch (err) {
      console.error(err);
      alert('Failed to add flower.');
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <input name="name" value={flower.name} onChange={handleChange} placeholder="Flower Name" required />
      <input name="color" value={flower.color} onChange={handleChange} placeholder="Color" required />
      <input name="price" value={flower.price} onChange={handleChange} placeholder="Price" type="number" required />
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required />
      <button type="submit" className="bg-green-500 text-white p-2 rounded">Add Flower</button>
    </form>
  );
}
