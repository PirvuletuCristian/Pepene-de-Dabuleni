import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Producer } from "../services/api.js";
import "../utils/leaflet";
import "./Map.css";

interface MapControllerProps {
  selectedProducer?: Producer;
  markerRefs: React.MutableRefObject<{ [key: number]: L.Marker }>;
  userLocation?: { lat: number; lon: number } | null;
}

// Separate component to handle map updates
const MapController: React.FC<MapControllerProps> = ({ selectedProducer, markerRefs, userLocation }) => {
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

  useEffect(() => {
    if (userLocation) {
      map.setView([userLocation.lat, userLocation.lon], 10, { animate: true });
    }
  }, [userLocation, map]);

  return null;
};

interface MapProps {
  producers: Producer[];
  selectedProducer?: Producer;
  onMarkerClick?: (producer: Producer) => void;
  userLocation?: { lat: number; lon: number } | null;
}

const Map: React.FC<MapProps> = ({ producers, selectedProducer, onMarkerClick, userLocation }) => {
  const defaultCenter: [number, number] = [45.7494, 21.2272]; // Romania center
  const markerRefs = useRef<{ [key: number]: L.Marker }>({});

  return (
    <MapContainer
      center={defaultCenter}
      zoom={7}
      scrollWheelZoom={true}
      className="map-container"
    >
      <MapController selectedProducer={selectedProducer} markerRefs={markerRefs} userLocation={userLocation} />
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
                <strong>Produs:</strong> {producer.product}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
