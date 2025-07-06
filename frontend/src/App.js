import React, { useState, useEffect } from "react";
import AllocationGrid from "./components/AllocationGrid";

function App() {
  const [allocs, setAllocs] = useState([]);
  const [shiftTimings, setShiftTimings] = useState([]);

  // 1) Load your shift definitions
  useEffect(() => {
    fetch("/data/shift_login_times.json")
      .then((res) => res.json())
      .then((data) => setShiftTimings(data))
      .catch((err) => console.error("Error loading shift timings:", err));
  }, []);

  // 2) Allocate‐cab handler
  const handleAllocate = async () => {
    try {
      const res = await fetch("/allocate_cabs", { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.json();
      // your backend returns { allocations: [ … ] }
      setAllocs(body.allocations || []);
    } catch (err) {
      console.error("Error allocating cabs:", err);
    }
  };

  return (
    // simple wrapper—feel free to replace with a CSS module if you like
    <div style={{ padding: 16, fontFamily: "sans-serif" }}>
      <AllocationGrid
        employeeData={allocs}
        shiftTimings={shiftTimings}
        onAllocate={handleAllocate}
      />
    </div>
  );
}

export default App;
