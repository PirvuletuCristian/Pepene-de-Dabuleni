import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Producer } from "../services/api.js";
import "./Map.css";

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

// Separate component to handle map updates
const MapController: React.FC<MapControllerProps> = ({ selectedProducer, markerRefs }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedProducer) {
      map.setView(
        [selectedProducer.latitude, selectedProducer.longitude],
        13,
        { animate: true }
      );

      // Open the popup for the selected producer
      const marker = markerRefs.current[selectedProducer.id];
      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedProducer, map, markerRefs]);

  return null;
};

interface MapProps {
  producers: Producer[];
  selectedProducer?: Producer;
  onMarkerClick?: (producer: Producer) => void;
}

const Map: React.FC<MapProps> = ({ producers, selectedProducer, onMarkerClick }) => {
  const defaultCenter: [number, number] = [45.7494, 21.2272]; // Romania center
  const markerRefs = useRef<{ [key: number]: L.Marker }>({});

  return (
    <MapContainer
      center={defaultCenter}
      zoom={7}
      scrollWheelZoom={true}
      className="map-container"
    >
      <MapController selectedProducer={selectedProducer} markerRefs={markerRefs} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {producers.map((producer) => (
        <Marker
          ref={(el) => {
            if (el) {
              markerRefs.current[producer.id] = el;
            }
          }}
          key={producer.id}
          position={[producer.latitude, producer.longitude]}
          eventHandlers={{
            click: () => onMarkerClick?.(producer),
          }}
        >
          <Popup>
            <div className="popup-content">
              <h3>{producer.name}</h3>
              <p>
                <strong>Product:</strong> {producer.product}
              </p>
              <p>
                <strong>Location:</strong> {producer.latitude.toFixed(4)}, {producer.longitude.toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
