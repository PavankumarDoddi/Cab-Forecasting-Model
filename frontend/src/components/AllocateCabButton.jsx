import React from "react";

export default function AllocateCabButton({ onResult }) {
  const handleClick = async () => {
    const res = await fetch("/allocate_cabs", { method: "POST" });
    const body = await res.json();
    onResult(body.allocations);
  };

  return (
    <button
      onClick={handleClick}
      className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded shadow"
    >
      Allocate Cab
    </button>
  );
}
