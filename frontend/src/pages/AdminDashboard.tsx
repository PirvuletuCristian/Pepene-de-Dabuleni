import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  getProducers,
  createProducer,
  updateProducer,
  deleteProducer,
  Producer,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import AdminMap from "../components/AdminMap";

interface ProducerFormData {
  name: string;
  product: string;
  latitude: string;
  longitude: string;
}

const emptyForm: ProducerFormData = { name: "", product: "", latitude: "", longitude: "" };

const AdminDashboard: React.FC = () => {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [selectedProducer, setSelectedProducer] = useState<Producer | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProducer, setEditingProducer] = useState<Producer | null>(null);
  const [deletingProducer, setDeletingProducer] = useState<Producer | null>(null);
  const [form, setForm] = useState<ProducerFormData>(emptyForm);
  const navigate = useNavigate();
  const { authenticated, loading: authLoading, signOut } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!authenticated) {
      navigate("/admin");
      return;
    }
    fetchProducers();
  }, [authenticated, authLoading, navigate]);

  const fetchProducers = async () => {
    try {
      setLoading(true);
      const data = await getProducers();
      setProducers(data);
    } catch (err) {
      setError("Nu s-au putut încărca producătorii");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {
      // signOut clears state regardless; navigation handled by auth effect
    }
    navigate("/admin");
  };

  const openAddDialog = (lat?: number, lng?: number) => {
    setEditingProducer(null);
    setForm(lat !== undefined && lng !== undefined
      ? { name: "", product: "", latitude: lat.toFixed(6), longitude: lng.toFixed(6) }
      : emptyForm
    );
    setDialogOpen(true);
  };

  const handleMapClick = (lat: number, lng: number) => {
    openAddDialog(lat, lng);
  };

  const openEditDialog = (producer: Producer) => {
    setEditingProducer(producer);
    setForm({
      name: producer.name,
      product: producer.product,
      latitude: String(producer.latitude),
      longitude: String(producer.longitude),
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (producer: Producer) => {
    setDeletingProducer(producer);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    setError(null);
    const payload = {
      name: form.name,
      product: form.product,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
    };

    try {
      if (editingProducer) {
        await updateProducer(editingProducer.id, payload);
        setSuccess(`Producătorul "${form.name}" a fost actualizat cu succes`);
      } else {
        await createProducer(payload);
        setSuccess(`Producătorul "${form.name}" a fost adăugat cu succes`);
      }
      setDialogOpen(false);
      setSelectedProducer(undefined);
      fetchProducers();
    } catch (err: any) {
      setError(err.response?.data?.error || "Operațiunea a eșuat");
    }
  };

  const handleDelete = async () => {
    if (!deletingProducer) return;
    setError(null);

    try {
      await deleteProducer(deletingProducer.id);
      setSuccess(`Producătorul "${deletingProducer.name}" a fost șters cu succes`);
      setDeleteDialogOpen(false);
      setDeletingProducer(null);
      setSelectedProducer(undefined);
      fetchProducers();
    } catch (err: any) {
      setError(err.response?.data?.error || "Ștergerea a eșuat");
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <AppBar position="static" color="success">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            🍉 Tablou de bord Admin
          </Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Deconectare
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {/* Map */}
        <Paper sx={{ mb: 3, overflow: "hidden" }}>
          <Box sx={{ p: 2, bgcolor: "#e8f5e9", borderBottom: "1px solid #c8e6c9" }}>
            <Typography variant="subtitle2" color="textSecondary">
              Faceți clic pe hartă pentru a adăuga un producător. Faceți clic pe un marker existent pentru a-l edita sau șterge.
            </Typography>
          </Box>
          <AdminMap
            producers={producers}
            selectedProducer={selectedProducer}
            onMapClick={handleMapClick}
            onMarkerEdit={(producer) => { setSelectedProducer(producer); openEditDialog(producer); }}
            onMarkerDelete={(producer) => { setSelectedProducer(producer); openDeleteDialog(producer); }}
          />
        </Paper>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5">Producători ({producers.length})</Typography>
          <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => openAddDialog()}>
            Adăugare Producător
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#e8f5e9" }}>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Nume</strong></TableCell>
                <TableCell><strong>Produs</strong></TableCell>
                <TableCell><strong>Latitudine</strong></TableCell>
                <TableCell><strong>Longitudine</strong></TableCell>
                <TableCell><strong>Creat</strong></TableCell>
                <TableCell align="center"><strong>Actiuni</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {producers.map((producer) => (
                <TableRow key={producer.id} hover>
                  <TableCell>{producer.id}</TableCell>
                  <TableCell>{producer.name}</TableCell>
                  <TableCell>{producer.product}</TableCell>
                  <TableCell>{producer.latitude}</TableCell>
                  <TableCell>{producer.longitude}</TableCell>
                  <TableCell>{new Date(producer.created_at).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => openEditDialog(producer)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => openDeleteDialog(producer)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {producers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">Niciun producător găsit</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProducer ? "Editare Producător" : "Adăugare Producător"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nume"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <TextField
            label="Produs"
            fullWidth
            margin="normal"
            value={form.product}
            onChange={(e) => setForm({ ...form, product: e.target.value })}
            required
          />
          <TextField
            label="Latitudine"
            fullWidth
            margin="normal"
            type="number"
            value={form.latitude}
            onChange={(e) => setForm({ ...form, latitude: e.target.value })}
            required
          />
          <TextField
            label="Longitudine"
            fullWidth
            margin="normal"
            type="number"
            value={form.longitude}
            onChange={(e) => setForm({ ...form, longitude: e.target.value })}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Anulare</Button>
          <Button onClick={handleSave} variant="contained" color="success">
            {editingProducer ? "Actualizare" : "Adăugare"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmați ștergerea</DialogTitle>
        <DialogContent>
          <Typography>
            Sunteți sigur că doriți să ștergeți producătorul "{deletingProducer?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Anulare</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Ștergere
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
