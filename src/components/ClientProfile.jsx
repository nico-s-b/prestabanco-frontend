import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import creditService from "../services/credit.service";
import clientService from "../services/client.service";
import CreditTable from "./CreditTable";
import trackingService from "../services/tracking.service";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper , Grid} from '@mui/material';

const ClientProfile = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [credits, setCredits] = useState([]);
  const [trackings, setTrackings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const userResponse = await clientService.getClientById(userId);
        setUserInfo(userResponse.data);

        const creditResponse = await creditService.getCreditsByClient(userId);
        setCredits(creditResponse.data);

        const trackingPromises = creditResponse.data.map(async (credit) => {
          try {
            const trackingResponse = await trackingService.getTracking(credit.id);
            return trackingResponse.data;
          } catch (error) {
            console.error(`Error al obtener tracking de crédito ${credit.id}:`, error);
            return null;
          }
        });

        const trackingData = await Promise.all(trackingPromises);
        setTrackings(trackingData.filter(Boolean));
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    fetchData();
  }, []);

  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [selectedCreditId, setSelectedCreditId] = useState(null);

  const handleCancelClick = (id) => {
    setSelectedCreditId(id);
    setOpenCancelDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenCancelDialog(false);
    setSelectedCreditId(null);
  };

  const handleConfirmCancel = async () => {
    try {
      await trackingService.updateTracking(selectedCreditId, "CANCELLED");
      alert("El crédito ha sido cancelado exitosamente.");
      // Actualizar los datos después de cancelar
      setCredits((prevCredits) =>
        prevCredits.map((credit) =>
          credit.id === selectedCreditId ? { ...credit, state: "CANCELLED" } : credit
        )
      );
      setTrackings((prevTrackings) =>
        prevTrackings.map((tracking) =>
          tracking.creditId === selectedCreditId ? { ...tracking, state: "CANCELLED" } : tracking
        )
      );
      setOpenCancelDialog(false);
    } catch (error) {
      console.error("Error al cancelar el crédito:", error);
      alert("Hubo un error al cancelar el crédito.");
    }
  };

  const handleRejectionClick = async (id) => {
    alert("Funcionalidad no implementada aún.");
  }

  return (
    <div>
    <Paper sx={{ maxWidth: 500, margin: 'auto', padding: 2, marginTop: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Perfil del Usuario
      </Typography>
      {userInfo ? (
        <>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell variant="head">Nombre</TableCell>
                  <TableCell>{`${userInfo.name} ${userInfo.paternalLastname} ${userInfo.maternalLastname}`}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">Email</TableCell>
                  <TableCell>{userInfo.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">Teléfono</TableCell>
                  <TableCell>{userInfo.phone}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">Fecha de Nacimiento</TableCell>
                  <TableCell>{format(new Date(userInfo.birthDate), 'dd-MM-yyyy')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">RUT</TableCell>
                  <TableCell>{userInfo.rut}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Grid container direction="column" alignItems="center" spacing={1} sx={{ marginTop: 2 }}>
            <Grid item>
              <Button
                variant="contained"
                color="info"
                onClick={() => navigate(`/client/info/${userInfo.id}`)}
                startIcon={<EditIcon />}
                sx={{
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                Información Financiera
              </Button>
            </Grid>
            <Grid item  sx={{ textAlign: "center" }}>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ textAlign: 'center' }}
              >
                Recuerda completar o actualizar tu información financiera para evaluar tus solicitudes más rápido.
              </Typography>
            </Grid>
          </Grid>



        </>
      ) : (
        <Typography align="center" color="textSecondary">
          Cargando la información del usuario...
        </Typography>
      )}
    </Paper>
  
      <CreditTable
        credits={credits}
        trackings={trackings}
        handleEditClick={(id) => navigate(`/credit/${id}`)}
        handleCancelClick={handleCancelClick}
        handleConditionsClick={(id) => navigate(`/credit/confirm/${id}`)}
        handleRejectionClick={handleRejectionClick}
      />

      {/* Cuadro de diálogo de confirmación */}
      <Dialog open={openCancelDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Cancelar Crédito</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            ¿Estás seguro de que deseas cancelar este crédito? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmCancel} color="error" variant="contained">
            Cancelar Crédito
          </Button>
          <Button onClick={handleCloseDialog} color="secondary" variant="outlined">
            Mantener Crédito
          </Button>
        </DialogActions>
      </Dialog>

    </div>

  );
};

export default ClientProfile;