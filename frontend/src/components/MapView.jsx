
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapView = ({ cab }) => {
  const office = cab.route[cab.route.length - 1];

  return (
    <MapContainer center={[office.lat, office.lon]} zoom={12} style={{ height: '500px', marginTop: '20px' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {cab.route.map((point, idx) => (
        <Marker key={idx} position={[point.lat, point.lon]}>
          <Popup>
            {idx < cab.route.length - 1 ? (
              <>
                <b>Employee:</b> {cab.employees[idx]?.name}<br />
                <b>Shift:</b> {cab.shift}<br />
                <b>Pickup Type:</b> {cab.pickup_type}<br />
                <b>Estimated Time:</b> {cab.estimated_arrival_times[idx] || 'N/A'}
              </>
            ) : (
              <b>Office: TIDEL Park</b>
            )}
          </Popup>
        </Marker>
      ))}
      <Polyline positions={cab.route.map((p) => [p.lat, p.lon])} color="purple" />
    </MapContainer>
  );
};
export default MapView;
