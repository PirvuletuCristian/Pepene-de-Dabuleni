import React, { useEffect, useState } from "react";
import { Box, Container, Paper, Typography, CircularProgress, Alert } from "@mui/material";
import { getProducers, Producer, deleteProducer } from "./services/api";
import Map from "./components/Map";
import SearchBar from "./components/SearchBar";
import ProducerCard from "./components/ProducerCard";
import "./App.css";

function App() {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [filteredProducers, setFilteredProducers] = useState<Producer[]>([]);
  const [selectedProducer, setSelectedProducer] = useState<Producer | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducers = async () => {
      try {
        const data = await getProducers();
        setProducers(data);
        setFilteredProducers(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load producers. Please try again later.");
        setLoading(false);
        console.error(err);
      }
    };

    fetchProducers();
  }, []);

  const handleLocationSearch = (producer: Producer | undefined) => {
    setSelectedProducer(producer);
    if (producer) {
      setFilteredProducers([producer]);
    } else {
      setFilteredProducers(producers);
    }
  };

  const handleProductFilter = (filtered: Producer[]) => {
    setFilteredProducers(filtered);
    setSelectedProducer(undefined);
  };

  const handleDeleteProducer = async (id: number) => {
    try {
      await deleteProducer(id);
      const updated = producers.filter((p) => p.id !== id);
      setProducers(updated);
      setFilteredProducers(updated.filter((p) => filteredProducers.find((fp) => fp.id === p.id)));
      setSelectedProducer(undefined);
    } catch (err) {
      console.error("Failed to delete producer:", err);
    }
  };

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="app-container">
      <Box className="header">
        <Typography variant="h3" component="h1" sx={{ color: "white" }}>
          🍉 Local Watermelon Producers
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "rgba(255,255,255,0.8)" }}>
          Find fresh, locally-grown watermelons near you
        </Typography>
      </Box>

      <Container maxWidth="xl" sx={{ height: "calc(100vh - 180px)", display: "flex", gap: 2, padding: 2 }}>
        {error && <Alert severity="error">{error}</Alert>}

        <Box className="map-section">
          <Map
            producers={filteredProducers}
            selectedProducer={selectedProducer}
            onMarkerClick={setSelectedProducer}
          />
        </Box>

        <Box className="sidebar">
          <SearchBar
            producers={producers}
            onLocationSearch={handleLocationSearch}
            onProductFilter={handleProductFilter}
          />

          <Typography variant="h6" sx={{ marginTop: "20px" }}>
            All Producers ({filteredProducers.length})
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ marginBottom: "10px" }}>
            Click on a marker to view producer details
          </Typography>

          <Box className="producers-list">
            {filteredProducers.length > 0 ? (
              filteredProducers.map((producer) => (
                <ProducerCard
                  key={producer.id}
                  producer={producer}
                  isSelected={selectedProducer?.id === producer.id}
                  onClick={setSelectedProducer}
                  onDelete={handleDeleteProducer}
                />
              ))
            ) : (
              <Typography color="textSecondary">No producers found</Typography>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
