import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function WhereToShop() {
  const [stores] = useState([
    { name: "Store 1", position: [30.0444, 31.2357] }, // Cairo
    { name: "Store 2", position: [30.0626, 31.2497] },
    { name: "Store 3", position: [30.0131, 31.2089] },
  ]);

  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Get user location using browser's Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);

  return (
    <div className="flex flex-col items-center w-full h-screen p-4">
      <h2 className="text-3xl font-bold mb-2">Where to Shop</h2>
      <p className="text-gray-600 mb-4">
        Discover recommended stores and shopping locations near you.
      </p>

      <div className="w-full h-full rounded-lg shadow-lg">
        <MapContainer
          center={userLocation || [30.0444, 31.2357]} // Use user location if available
          zoom={13}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* User location marker */}
          {userLocation && (
            <>
              <Marker position={userLocation}>
                <Popup>Your Current Location</Popup>
              </Marker>
              {/* Optional: Circle around user */}
              <Circle
                center={userLocation}
                radius={200} // radius in meters
                pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.2 }}
              />
            </>
          )}

          {/* Store markers */}
          {stores.map((store, index) => (
            <Marker key={index} position={store.position}>
              <Popup>{store.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
