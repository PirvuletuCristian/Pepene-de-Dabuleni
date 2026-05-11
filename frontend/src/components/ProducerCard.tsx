import React, { useState, useEffect } from "react";
import { Card, CardContent, CardActions, Button, Typography, Box } from "@mui/material";
import { Producer } from "../services/api";
import { getCityFromCoordinates } from "../utils/geocoding";
import "./ProducerCard.css";

interface ProducerCardProps {
  producer: Producer;
  isSelected?: boolean;
  onDelete?: (id: number) => void;
  onClick?: (producer: Producer) => void;
}

const ProducerCard: React.FC<ProducerCardProps> = ({ producer, isSelected, onDelete, onClick }) => {
  const [city, setCity] = useState<string>("Se încarcă...");

  useEffect(() => {
    const fetchCity = async () => {
      const cityName = await getCityFromCoordinates(producer.latitude, producer.longitude);
      setCity(cityName);
    };
    fetchCity();
  }, [producer.latitude, producer.longitude]);

  return (
    <Card 
      className={`producer-card ${isSelected ? "selected" : ""}`}
      onClick={() => onClick?.(producer)}
      sx={{ 
        marginBottom: "10px",
        cursor: "pointer",
        border: isSelected ? "2px solid #4CAF50" : "none",
      }}
    >
      <CardContent>
        <Typography variant="h6" component="div">
          {producer.name}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          {producer.product}
        </Typography>
        <Box sx={{ marginTop: "10px", fontSize: "12px" }}>
          <Typography variant="body2">
            <strong>Locație:</strong> {city}
          </Typography>
          <Typography variant="body2">
            <strong>Creat:</strong> {new Date(producer.created_at).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        {onDelete && (
          <Button
            size="small"
            color="error"
            onClick={() => onDelete(producer.id)}
          >
            Ștergere
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default ProducerCard;
