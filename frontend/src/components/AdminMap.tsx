import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Producer } from "../services/api";

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface MapControllerProps {
  selectedProducer?: Producer;
  markerRefs: React.MutableRefObject<{ [key: number]: L.Marker }>;
}

const MapController: React.FC<MapControllerProps> = ({ selectedProducer, markerRefs }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedProducer) {
      map.setView([selectedProducer.latitude, selectedProducer.longitude], 13, { animate: true });
      const marker = markerRefs.current[selectedProducer.id];
      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedProducer, map, markerRefs]);

  return null;
};

interface MapClickHandlerProps {
  onMapClick: (lat: number, lng: number) => void;
}

const MapClickHandler: React.FC<MapClickHandlerProps> = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

interface AdminMapProps {
  producers: Producer[];
  selectedProducer?: Producer;
  onMapClick: (lat: number, lng: number) => void;
  onMarkerEdit: (producer: Producer) => void;
  onMarkerDelete: (producer: Producer) => void;
}

const AdminMap: React.FC<AdminMapProps> = ({
  producers,
  selectedProducer,
  onMapClick,
  onMarkerEdit,
  onMarkerDelete,
}) => {
  const defaultCenter: [number, number] = [45.7494, 21.2272];
  const markerRefs = useRef<{ [key: number]: L.Marker }>({});

  return (
    <MapContainer
      center={defaultCenter}
      zoom={7}
      scrollWheelZoom={true}
      style={{ height: "450px", width: "100%", borderRadius: "8px", cursor: "crosshair" }}
    >
      <MapController selectedProducer={selectedProducer} markerRefs={markerRefs} />
      <MapClickHandler onMapClick={onMapClick} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {producers.map((producer) => (
        <Marker
          ref={(el) => {
            if (el) markerRefs.current[producer.id] = el;
          }}
          key={producer.id}
          position={[producer.latitude, producer.longitude]}
        >
          <Popup>
            <div style={{ minWidth: "180px" }}>
              <strong style={{ fontSize: "15px" }}>{producer.name}</strong>
              <p style={{ margin: "4px 0 8px 0", color: "#555" }}>{producer.product}</p>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => onMarkerEdit(producer)}
                  style={{
                    flex: 1,
                    padding: "5px 10px",
                    background: "#1976d2",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Editare
                </button>
                <button
                  onClick={() => onMarkerDelete(producer)}
                  style={{
                    flex: 1,
                    padding: "5px 10px",
                    background: "#d32f2f",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Ștergere
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default AdminMap;
