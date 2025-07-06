import React, { useState } from "react";
import axios from "axios";

export default function EmployeeRegistrationForm() {
  const [employeeId, setEmployeeId] = useState("");
  const [locMethod, setLocMethod]   = useState("auto"); // or 'manual'
  const [address, setAddress]       = useState("");
  const [coords, setCoords]         = useState({ lat: null, lng: null });
  const [assigned, setAssigned]     = useState(null);
  const [error, setError]           = useState("");

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCoords({ lat: coords.latitude, lng: coords.longitude });
      },
      () => setError("Permission denied or unavailable")
    );
  };

  const geocodeAddress = async () => {
    try {
      const res = await axios.get("/api/geocode", { params: { address } });
      setCoords({ lat: res.data.lat, lng: res.data.lng });
    } catch (_) {
      setError("Address lookup failed");
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(""); setAssigned(null);
    if (!employeeId || !coords.lat) {
      setError("ID and location required");
      return;
    }
    try {
      const res = await axios.post("/employees/register", {
        employee_id: employeeId,
        location: {
          lat: coords.lat,
          lng: coords.lng,
          address: locMethod==="manual" ? address : undefined
        }
      });
      setAssigned(res.data.assigned_nodal);
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <h2>Register Employee</h2>

      <label>
        Employee ID
        <input
          type="text"
          value={employeeId}
          onChange={e => setEmployeeId(e.target.value)}
          required
        />
      </label>

      <div>
        <label>
          <input
            type="radio"
            checked={locMethod==="auto"}
            onChange={()=>setLocMethod("auto")}
          /> Auto-detect location
        </label>
        <label>
          <input
            type="radio"
            checked={locMethod==="manual"}
            onChange={()=>setLocMethod("manual")}
          /> Enter address manually
        </label>
      </div>

      {locMethod==="auto" ? (
        <button type="button" onClick={detectLocation}>
          Detect my location
        </button>
      ) : (
        <>
          <input
            type="text"
            placeholder="Full address"
            value={address}
            onChange={e=>setAddress(e.target.value)}
          />
          <button type="button" onClick={geocodeAddress}>
            Lookup address
          </button>
        </>
      )}

      {coords.lat && (
        <p>Detected coords: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</p>
      )}

      <button type="submit">Register</button>

      {assigned && (
        <p>
          ✅ Registered—assigned nodal point: <b>{assigned.id}</b>
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}