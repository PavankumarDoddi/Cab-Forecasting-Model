import React, { useState, useMemo, useEffect } from "react";
import AllocationGrid from "./AllocationGrid";
import CabMap from "./CabMap";

export default function ShiftDetailPanel({ data = [], officeCoords }) {
    const [nodalPoints, setNodalPoints] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState([]);

  useEffect(() => {
    fetch("/api/nodal_points")
      .then(res => res.json())
      .then(setNodalPoints);
    fetch("/api/employee_details")
      .then(res => res.json())
      .then(setEmployeeDetails);
  }, []);

  const shiftOptions = useMemo(() => {
    const shifts = Array.from(new Set(data.map((d) => d.shift)));
    return ["All", ...shifts];
  }, [data]);

  const [selectedShift, setSelectedShift] = useState("");

  const filtered = useMemo(() => {
    if (!selectedShift || selectedShift === "All") return data;
    return data.filter((d) => d.shift === selectedShift);
  }, [data, selectedShift]);

  // 3️⃣ Enrich your data with valid [lat, lng] coords
  const enriched = useMemo(() => {
    return filtered.map((r) => {
      const isDoorStep = ["Morning", "Night"].includes(r.shift);
      const point = isDoorStep
        ? employeeDetails[r.employee_id]?.coords
        : nodalPoints[r.nodal_id]?.coords;
      // normalize to [lat, lng]
      const coords = Array.isArray(point)
        ? point
        : [point.lat, point.lng];
      return { ...r, pickup: { ...r.pickup, coords } };
    });
  }, [filtered]);

  const cabGroups = useMemo(() => {
    const groups = {};
    enriched.forEach((item) => {
      if (!groups[item.cab_id]) groups[item.cab_id] = [];
      groups[item.cab_id].push(item.employee_id);
    });
    return groups;
  }, [enriched]);

  // 4️⃣ Ensure officeCoords is an array
  const center = Array.isArray(officeCoords)
    ? officeCoords
    : [officeCoords.lat, officeCoords.lng];

  return (
    <div className="space-y-4">
      {/* Shift filter dropdown */}
      <div className="bg-white shadow rounded-lg p-4">
        <label className="block mb-2 font-medium">Select Shift</label>
        <select
          className="w-full p-2 border rounded"
          value={selectedShift}
          onChange={(e) => setSelectedShift(e.target.value)}
        >
          <option value="">-- choose --</option>
          {shiftOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {selectedShift && (
        <>
          {/* 2️⃣ Cab ID + Employees Grid */}
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">
              Cab Allocation for {selectedShift}
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 py-1 text-left">Cab ID</th>
                  <th className="px-2 py-1 text-left">Employees</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(cabGroups).map(([cabId, employees]) => (
                  <tr key={cabId} className="border-t">
                    <td className="px-2 py-1 align-top">{cabId}</td>
                    <td className="px-2 py-1">{employees.join(", ")}</td>
                  </tr>
                ))}
                {!Object.keys(cabGroups).length && (
                  <tr>
                    <td colSpan="2" className="text-center py-4 text-gray-500">
                      No allocations for this shift.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 3️⃣ Map of pickups */}
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">
              Pickup Map for {selectedShift}
            </h3>
            <CabMap data={enriched} officeCoords={center} />
          </div>
        </>
      )}
    </div>
  );
}