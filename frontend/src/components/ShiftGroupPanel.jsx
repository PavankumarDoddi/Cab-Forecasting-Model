// src/components/ShiftGroupPanel.jsx
import React, { useState, useMemo } from "react";

export default function ShiftGroupPanel({ data = [] }) {
  // 1. Ensure data is always an array
  const safeData = Array.isArray(data) ? data : [];

  // 2. Extract unique shifts (will be [] if no data)
  const shifts = useMemo(
    () => [...new Set(safeData.map((d) => d.shift).filter(Boolean))],
    [safeData]
  );

  // 3. Selected shift default to first, or empty string
  const [sel, setSel] = useState(shifts[0] || "");

  // 4. Compute summary only when sel is truthy
  const summary = useMemo(() => {
    if (!sel) return {}; 
    const filtered = safeData.filter((d) => d.shift === sel);
    const byCab = {};
    filtered.forEach((r) => {
      if (!byCab[r.cab_id]) {
        byCab[r.cab_id] = { count: 0, type: r.cab_type || "Unknown" };
      }
      byCab[r.cab_id].count++;
    });
    return byCab;
  }, [safeData, sel]);

  return (
    <div>
      <label className="block mb-2 text-gray-700 font-medium">Shift</label>
      <select
        className="w-full mb-4 p-2 border rounded"
        value={sel}
        onChange={(e) => setSel(e.target.value)}
        disabled={shifts.length === 0}
      >
        {shifts.length > 0 ? (
          shifts.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))
        ) : (
          <option>No shifts</option>
        )}
      </select>

      {shifts.length > 0 && sel ? (
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 py-1 text-left">Cab No.</th>
              <th className="px-2 py-1 text-center"># Emp</th>
              <th className="px-2 py-1 text-left">Type</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(summary).map(([cab, info]) => (
              <tr key={cab} className="border-t">
                <td className="px-2 py-1">{cab}</td>
                <td className="px-2 py-1 text-center">{info.count}</td>
                <td className="px-2 py-1">{info.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-sm text-gray-500">No data to display.</p>
      )}
    </div>
  );
}
