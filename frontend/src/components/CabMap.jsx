import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function CabMap({ data, officeCoords }) {
  return (
    <div className="w-full h-60 rounded">
      <MapContainer center={officeCoords} zoom={12} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {data.map((r, i) => (
          <Marker key={i} position={r.pickup.coords}>
            <Popup className="text-sm">
              <strong>{r.employee_id}</strong><br />
              Shift: {r.shift}<br />
              Cab: {r.cab_id}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}