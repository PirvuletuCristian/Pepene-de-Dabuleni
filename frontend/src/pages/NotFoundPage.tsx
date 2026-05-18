import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)",
        gap: 2,
      }}
    >
      <Typography variant="h1" sx={{ color: "white", fontSize: "6rem", fontWeight: "bold" }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ color: "rgba(255,255,255,0.85)" }}>
        🍉 Pagina nu a fost găsită
      </Typography>
      <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.6)" }}>
        Pagina pe care o cauți nu există.
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate("/")}
        sx={{ mt: 2, backgroundColor: "#4CAF50", textTransform: "none", fontSize: "16px" }}
      >
        Înapoi la hartă
      </Button>
    </Box>
  );
};

export default NotFoundPage;
