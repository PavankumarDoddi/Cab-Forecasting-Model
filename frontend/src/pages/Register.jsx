
import { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState({ lat: '', lon: '', address: '' });
  const [message, setMessage] = useState('');

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({ ...location, lat: pos.coords.latitude, lon: pos.coords.longitude });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post('http://localhost:8000/employee/register', {
      name,
      location
    });
    setMessage(res.data.message + ` | Nodal Point: ${res.data.nodal_point}`);
  };

  return (
    <div className="p-4">
      <h2>Cab Registration</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input placeholder="Address" value={location.address} onChange={(e) => setLocation({ ...location, address: e.target.value })} required />
        <button type="button" onClick={getCurrentLocation}>Get Current Location</button>
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};
export default Register;
