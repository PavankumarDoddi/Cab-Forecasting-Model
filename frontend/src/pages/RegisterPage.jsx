import React, { useState } from 'react';
import axios from 'axios';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', address: '', lat: '', lon: '' });
  const [submitted, setSubmitted] = useState(null);

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm({ ...form, lat: pos.coords.latitude, lon: pos.coords.longitude });
    }, () => alert("Location access denied."));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/register", form);
      setSubmitted(res.data);
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Cab Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name:</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-medium">Full Address:</label>
          <textarea name="address" value={form.address} onChange={handleChange} required className="w-full p-2 border rounded"></textarea>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={getCurrentLocation} className="bg-blue-500 text-white px-3 py-1 rounded">Use Current Location</button>
          <span className="text-sm text-gray-500">or enter manually below</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Latitude:</label>
            <input type="number" step="any" name="lat" value={form.lat} onChange={handleChange} required className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block font-medium">Longitude:</label>
            <input type="number" step="any" name="lon" value={form.lon} onChange={handleChange} required className="w-full p-2 border rounded" />
          </div>
        </div>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
      </form>

      {submitted && (
        <div className="mt-6 p-4 bg-green-100 rounded">
          <h3 className="font-semibold text-green-700">Registration Successful!</h3>
          <p><strong>Name:</strong> {submitted.name}</p>
          <p><strong>Assigned Nodal Point:</strong> {submitted.nodal}</p>
          <p><strong>Shift:</strong> {submitted.shift}</p>
        </div>
      )}
    </div>
  );
}
