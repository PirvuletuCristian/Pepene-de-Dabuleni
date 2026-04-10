import React, { useState } from "react";
import { TextField, Box, Button } from "@mui/material";
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from "@mui/icons-material";
import { Producer } from "../services/api";
import "./SearchBar.css";

interface SearchBarProps {
  producers: Producer[];
  onLocationSearch: (producer: Producer | undefined) => void;
  onProductFilter: (filteredProducers: Producer[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  producers,
  onLocationSearch,
  onProductFilter,
}) => {
  const [locationQuery, setLocationQuery] = useState("");
  const [productQuery, setProductQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLocationSearch = () => {
    if (!locationQuery.trim()) {
      onLocationSearch(undefined);
      return;
    }

    const found = producers.find((p) =>
      p.name.toLowerCase().includes(locationQuery.toLowerCase())
    );
    onLocationSearch(found);
  };

  const handleProductFilter = () => {
    if (!productQuery.trim()) {
      onProductFilter(producers);
      return;
    }

    const filtered = producers.filter((p) =>
      p.product.toLowerCase().includes(productQuery.toLowerCase())
    );
    onProductFilter(filtered);
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
        {isExpanded ? "Hide Search" : "Show Search"} 
        {isExpanded ? <ExpandLessIcon sx={{ marginLeft: "8px" }} /> : <ExpandMoreIcon sx={{ marginLeft: "8px" }} />}
      </Button>

      <Box className={`search-bar-container ${isExpanded ? "expanded" : "collapsed"}`}>
        <div className="search-input-group">
          <TextField
            placeholder="Search by location (e.g., 'Riverside', 'Los Angeles')..."
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
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
            onClick={handleLocationSearch}
            sx={{
              backgroundColor: "#4CAF50",
              marginLeft: "10px",
              textTransform: "none",
            }}
          >
            Search Location
          </Button>
        </div>

        <div className="search-input-group">
          <TextField
            placeholder="Search by watermelon type (e.g., 'Sugar Baby', 'Crimson')..."
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
            Filter Type
          </Button>
        </div>
      </Box>
    </Box>
  );
};

export default SearchBar;
