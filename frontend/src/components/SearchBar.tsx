import React, { useState } from "react";
import { TextField, Box, Button, CircularProgress, Alert } from "@mui/material";
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon, MyLocation as MyLocationIcon, Clear as ClearIcon } from "@mui/icons-material";
import { Producer } from "../services/api";
import "./SearchBar.css";

const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

interface SearchBarProps {
  producers: Producer[];
  onLocationSearch: (producer: Producer | undefined) => void;
  onProductFilter: (filteredProducers: Producer[]) => void;
  onUserLocation: (coords: { lat: number; lon: number } | null) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  producers,
  onLocationSearch,
  onProductFilter,
  onUserLocation,
}) => {
  const [productQuery, setProductQuery] = useState("");
  const [producerQuery, setProducerQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [locating, setLocating] = useState(false);
  const [radius, setRadius] = useState<string>("30");
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [noResults, setNoResults] = useState(false);

  const applyFilters = (
    coords: { lat: number; lon: number } | null,
    product: string,
    producer: string,
    km: number
  ) => {
    let result = producers;
    if (coords) {
      result = result.filter(
        (p) => haversineKm(coords.lat, coords.lon, p.latitude, p.longitude) <= km
      );
    }
    if (product.trim()) {
      result = result.filter((p) =>
        p.product.toLowerCase().includes(product.toLowerCase())
      );
    }
    if (producer.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(producer.toLowerCase())
      );
    }
    onProductFilter(result);
    setNoResults(result.length === 0);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocalizarea nu este suportată de browserul dvs.");
      return;
    }
    const km = parseFloat(radius);
    if (isNaN(km) || km <= 0) {
      alert("Introduceți o distanță validă în km.");
      return;
    }
    setLocating(true);

    let watchId: number;
    let bestPosition: GeolocationPosition | null = null;
    let done = false;

    // Accept the position and clean up
    const finish = (pos: GeolocationPosition | null) => {
      if (done) return;
      done = true;
      clearTimeout(fallbackTimer);
      navigator.geolocation.clearWatch(watchId);
      setLocating(false);
      if (!pos) {
        alert("Nu s-a putut determina locația dvs.");
        return;
      }
      const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
      setUserCoords(coords);
      onUserLocation(coords);
      applyFilters(coords, productQuery, producerQuery, km);
    };

    // After 15s fall back to the best reading we have (even if imprecise)
    const fallbackTimer = setTimeout(() => finish(bestPosition), 15000);

    // watchPosition keeps refining the fix; accept as soon as accuracy ≤ 3 km
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        bestPosition = position;
        if (position.coords.accuracy <= 3000) {
          finish(position);
        }
      },
      () => finish(null),
      { maximumAge: 0, enableHighAccuracy: true }
    );
  };

  const handleProductFilter = () => {
    applyFilters(userCoords, productQuery, producerQuery, parseFloat(radius) || 30);
  };

  const handleProducerSearch = () => {
    applyFilters(userCoords, productQuery, producerQuery, parseFloat(radius) || 30);
  };

  return (
    <Box className="search-bar-wrapper">
      <Button
        variant="contained"
        onClick={() => setIsExpanded(!isExpanded)}
        className="search-toggle-btn"
        sx={{
          backgroundColor: "#4CAF50",
          width: "100%",
          textTransform: "none",
          fontSize: "16px",
        }}
      >
        {isExpanded ? "Ascunde căutarea" : "Arată căutarea"} 
        {isExpanded ? <ExpandLessIcon sx={{ marginLeft: "8px" }} /> : <ExpandMoreIcon sx={{ marginLeft: "8px" }} />}
      </Button>

      <Box className={`search-bar-container ${isExpanded ? "expanded" : "collapsed"}`}>
        <div className="search-input-group">
          <TextField
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            type="number"
            variant="outlined"
            label="Rază (km)"
            slotProps={{ inputLabel: { shrink: true }, input: { inputProps: { min: 1 } } }}
            sx={{ width: "130px", flexShrink: 0, "& .MuiOutlinedInput-root": { borderRadius: "8px", backgroundColor: "white" } }}
          />
          <Button
            variant="contained"
            onClick={handleUseMyLocation}
            disabled={locating}
            startIcon={locating ? <CircularProgress size={18} color="inherit" /> : <MyLocationIcon />}
            sx={{
              backgroundColor: "#4CAF50",
              textTransform: "none",
              fontSize: "15px",
              padding: "10px",
              flex: 1,
            }}
          >
            {locating ? "Se detectează locația..." : "Folosește locația mea"}
          </Button>
        </div>

        <div className="search-input-group">
          <TextField
            placeholder="Caută după tipul pepenelui (ex: 'Sugar Baby', 'Crimson')..."
            value={productQuery}
            onChange={(e) => setProductQuery(e.target.value)}
            variant="outlined"
            fullWidth
            className="search-input"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleProductFilter}
            sx={{
              backgroundColor: "#2196F3",
              marginLeft: "10px",
              textTransform: "none",
            }}
          >
            Caută produs
          </Button>
        </div>

        <div className="search-input-group">
          <TextField
            placeholder="Caută după numele producătorului..."
            value={producerQuery}
            onChange={(e) => setProducerQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleProducerSearch()}
            variant="outlined"
            fullWidth
            className="search-input"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
          />
          <Button
            variant="contained"
            onClick={handleProducerSearch}
            sx={{ backgroundColor: "#FF9800", marginLeft: "10px", textTransform: "none" }}
          >
            Caută producător
          </Button>
        </div>

        <Button
          variant="outlined"
          onClick={() => {
            setProductQuery("");
            setProducerQuery("");
            setUserCoords(null);
            setNoResults(false);
            onProductFilter(producers);
            onLocationSearch(undefined);
            onUserLocation(null);
          }}
          startIcon={<ClearIcon />}
          fullWidth
          sx={{
            borderColor: "white",
            color: "white",
            textTransform: "none",
            "&:hover": { borderColor: "#e0e0e0", backgroundColor: "rgba(255,255,255,0.1)" },
          }}
        >
          Resetează filtrele
        </Button>
      </Box>

      {noResults && (
        <Alert severity="warning" sx={{ mt: 1 }} onClose={() => setNoResults(false)}>
          Niciun producător găsit pentru filtrele aplicate.
        </Alert>
      )}
    </Box>
  );
};

export default SearchBar;
