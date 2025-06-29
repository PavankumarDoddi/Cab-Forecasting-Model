
import { useEffect, useState } from 'react';
import axios from 'axios';
import MapView from '../components/MapView';

const Dashboard = () => {
  const [shift, setShift] = useState('');
  const [cabs, setCabs] = useState([]);
  const [selectedCab, setSelectedCab] = useState(null);

  useEffect(() => {
    if (shift) {
      axios.get(`http://localhost:8000/cab/by_shift/${shift}`).then((res) => {
        setCabs(res.data);
        setSelectedCab(null);
      });
    }
  }, [shift]);

  const selectCab = (cabId) => {
    axios.get(`http://localhost:8000/cab/by_cab/${shift}/${cabId}`).then((res) => {
      setSelectedCab(res.data);
    });
  };

  return (
    <div className="p-4">
      <h2>Cab Allocation Dashboard</h2>

      <select onChange={(e) => setShift(e.target.value)}>
        <option value="">Select Shift</option>
        <option value="Morning">Morning</option>
        <option value="General">General</option>
        <option value="Mid Day">Mid Day</option>
        <option value="Afternoon">Afternoon</option>
        <option value="Night">Night</option>
      </select>

      {shift && (
        <>
          <select onChange={(e) => selectCab(e.target.value)} className="ml-4">
            <option value="">Select Cab</option>
            {cabs.map((c) => (
              <option key={c.cab_id} value={c.cab_id}>
                {c.cab_id} ({c.cab_type}) - {c.employees.length} employees
              </option>
            ))}
          </select>

          {selectedCab && <MapView cab={selectedCab} />}
        </>
      )}
    </div>
  );
};
export default Dashboard;
