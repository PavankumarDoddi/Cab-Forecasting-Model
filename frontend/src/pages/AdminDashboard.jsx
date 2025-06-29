import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [forecast, setForecast] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res1 = await axios.get("/pending");
    const res2 = await axios.get("/approved");
    const res3 = await axios.get("/cab_forecast");
    setPending(res1.data);
    setApproved(res2.data);
    setForecast(res3.data);
  };

  const approve = async (id) => {
    await axios.post("/approve", { id });
    fetchData();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      <h3 className="text-xl font-semibold mt-4">Pending Requests</h3>
      {pending.map(e => (
        <div key={e.id} className="p-2 border my-2 flex justify-between">
          <span>{e.name} - {e.nodal} - {e.shift}</span>
          <button onClick={() => approve(e.id)} className="bg-blue-500 text-white px-2 py-1 rounded">Approve</button>
        </div>
      ))}

      <h3 className="text-xl font-semibold mt-6">Approved Employees</h3>
      <table className="w-full table-auto border mt-2">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Nodal</th>
            <th className="border px-2 py-1">Shift</th>
          </tr>
        </thead>
        <tbody>
          {approved.map(e => (
            <tr key={e.id}>
              <td className="border px-2 py-1">{e.name}</td>
              <td className="border px-2 py-1">{e.nodal}</td>
              <td className="border px-2 py-1">{e.shift}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-xl font-semibold mt-6">Cab Allocation</h3>
      {Object.entries(forecast).map(([shift, cabs]) => (
        <div key={shift} className="mb-4">
          <h4 className="text-lg font-bold">{shift} Shift</h4>
          {cabs.map(cab => (
            <div key={cab.cab_id} className="p-2 border my-1">
              <strong>{cab.cab_id} ({cab.cab_type})</strong>
              <ul className="list-disc ml-6">
                {cab.employees.map(emp => (
                  <li key={emp.id}>{emp.name} - {emp.nodal}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
