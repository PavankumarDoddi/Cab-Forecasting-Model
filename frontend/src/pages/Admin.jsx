
import { useEffect, useState } from 'react';
import axios from 'axios';

const Admin = () => {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);

  const fetchPending = async () => {
    const res = await axios.get('http://localhost:8000/employee/list');
    setPending(res.data);
  };

  const fetchApproved = async () => {
    const res = await axios.get('http://localhost:8000/admin/approved');
    setApproved(res.data);
  };

  const approve = async (id) => {
    await axios.post(`http://localhost:8000/admin/approve/${id}`);
    fetchPending();
    fetchApproved();
  };

  useEffect(() => {
    fetchPending();
    fetchApproved();
  }, []);

  return (
    <div className="p-4">
      <h2>Pending Approvals</h2>
      <ul>
        {pending.map((emp) => (
          <li key={emp.id}>
            {emp.name} ({emp.location.address}) → Nodal: {emp.nodal_point}
            <button onClick={() => approve(emp.id)}>Approve</button>
          </li>
        ))}
      </ul>
      <h2 className="mt-6">Approved Employees</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>Nodal Point</th>
            <th>Shift</th>
          </tr>
        </thead>
        <tbody>
          {approved.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.location.address}</td>
              <td>{emp.nodal_point}</td>
              <td>{emp.shift || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Admin;
