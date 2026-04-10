import React from "react";
import { Card, CardContent, CardActions, Button, Typography, Box } from "@mui/material";
import { Producer } from "../services/api";
import "./ProducerCard.css";

interface ProducerCardProps {
  producer: Producer;
  isSelected?: boolean;
  onDelete?: (id: number) => void;
  onClick?: (producer: Producer) => void;
}

const ProducerCard: React.FC<ProducerCardProps> = ({ producer, isSelected, onDelete, onClick }) => {
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
            <strong>Location:</strong> {producer.latitude.toFixed(4)}, {producer.longitude.toFixed(4)}
          </Typography>
          <Typography variant="body2">
            <strong>Created:</strong> {new Date(producer.created_at).toLocaleDateString()}
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
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default ProducerCard;
