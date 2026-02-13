import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation, Car } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import './MapComponent.css';

// --- Custom Icons ---
// Create flexible icons using Lucide React components
const createIcon = (IconComponent, color) => {
  const iconMarkup = renderToStaticMarkup(
    <div style={{
      color: color,
      filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))'
    }}>
      <IconComponent size={32} fill="currentColor" stroke="white" strokeWidth={1.5} />
    </div>
  );

  return L.divIcon({
    html: iconMarkup,
    className: 'custom-leaflet-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 30], // Point of the icon which triggers events
    popupAnchor: [0, -32] // Point from which the popup should open
  });
};

const userIcon = createIcon(Navigation, '#3b82f6'); // Blue
const pickupIcon = createIcon(MapPin, '#10b981');   // Green
const dropoffIcon = createIcon(MapPin, '#ef4444');  // Red
const driverIcon = createIcon(Car, '#f59e0b');      // Orange

// --- Helper Components ---

// Component to handle map clicks
const LocationSelector = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        // Return [lat, lng]
        onLocationSelect([e.latlng.lat, e.latlng.lng]);
      }
    },
  });
  return null;
};

// Component to handle auto-centering and fitting bounds
const MapController = ({ center, bounds }) => {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (center) {
      map.flyTo(center, map.getZoom());
    }
  }, [center, bounds, map]);

  return null;
};

// --- Main Component ---
const MapComponent = ({
  pickup,
  dropoff,
  driver,
  onLocationSelect,
  className
}) => {
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]); // Default NYC
  const [zoom, setZoom] = useState(13);

  // Get User's Real Location on Mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coords = [latitude, longitude];
          setUserLocation(coords);
          if (!pickup && !dropoff) {
            setMapCenter(coords);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, [pickup, dropoff]);

  // Calculate Bounds if multiple points exist
  const getBounds = () => {
    const points = [];
    if (pickup) points.push(pickup.coordinates.coordinates.slice().reverse()); // GeoJSON [lng,lat] -> Leaflet [lat,lng]
    if (dropoff) points.push(dropoff.coordinates.coordinates.slice().reverse());
    if (driver) points.push(driver.coordinates.coordinates.slice().reverse());
    if (userLocation && !pickup && !dropoff) points.push(userLocation);

    // If only one point, return null (use center)
    if (points.length < 2) return null;
    return L.latLngBounds(points);
  };

  const bounds = getBounds();

  // Determine center priority: Pickup > User > Default
  const currentCenter = pickup
    ? pickup.coordinates.coordinates.slice().reverse()
    : (userLocation || mapCenter);

  return (
    <div className={`map-wrapper ${className || ''}`} style={{ height: '100%', width: '100%', minHeight: '300px', borderRadius: '12px', overflow: 'hidden', zIndex: 0 }}>
      <MapContainer
        center={currentCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false} // We can add custom zoom control if needed
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController center={currentCenter} bounds={bounds} />
        <LocationSelector onLocationSelect={onLocationSelect} />

        {/* Markers */}
        {userLocation && !pickup && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {pickup && (
          <Marker position={pickup.coordinates.coordinates.slice().reverse()} icon={pickupIcon}>
            <Popup>Pickup: {pickup.address}</Popup>
          </Marker>
        )}

        {dropoff && (
          <Marker position={dropoff.coordinates.coordinates.slice().reverse()} icon={dropoffIcon}>
            <Popup>Dropoff: {dropoff.address}</Popup>
          </Marker>
        )}

        {driver && (
          <Marker position={driver.coordinates.coordinates.slice().reverse()} icon={driverIcon}>
            <Popup>Driver</Popup>
          </Marker>
        )}

      </MapContainer>
    </div>
  );
};

export default MapComponent;
