import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { login } from "../services/api";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username, password);
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Autentificare eșuată. Vă rugăm să încercați din nou.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)",
      }}
    >
      <Paper elevation={6} sx={{ padding: 4, maxWidth: 400, width: "100%" }}>
        <Typography variant="h4" align="center" gutterBottom>
          🍉 Autentificare Admin
        </Typography>
        <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
          Pepene de Dabuleni - Administrare
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Utilizator"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
          <TextField
            label="Parolă"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="success"
            disabled={loading}
            sx={{ mt: 2, py: 1.5 }}
          >
            {loading ? "Se autentifică..." : "Autentificare"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;
