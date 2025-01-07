import React, { useEffect, useState } from "react";
import { useNavigate , useParams } from "react-router-dom";
import { Grid, Typography, Button, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import creditService from "../services/credit.service";
import trackingService from "../services/tracking.service";
import Documents from "./Documents";
import CreditInfo from "./CreditInfo";
import CancelIcon from '@mui/icons-material/Cancel';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

const CreditView = () => {
  const navigate = useNavigate();
  const [creditInfo, setCreditInfo] = useState(null);
  const { id } = useParams();
  const [tracking, setTracking] = useState(null);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState(""); 

  const fetchTracking = async () => {
    try {
      const trackingResponse = await trackingService.getTracking(id);
      setTracking(trackingResponse.data);
    } catch (error) {
      console.error("Error al actualizar el tracking:", error);
    }
  };

  useEffect(() => {
    const fetchCreditInfo = async () => {
      try {
        const creditResponse = await creditService.getCreditById(id);
        setCreditInfo(creditResponse.data);
        fetchTracking();
      } catch (error) {
        console.error("Error al obtener la información del crédito:", error);
      }
    }
    if (id) {
      fetchCreditInfo();
    }
  }, [id]);

  const handleOpenConfirmDialog = (action) => {
    setDialogAction(action);
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setDialogAction("");
  };

  const handleConfirmAction = async () => {
    handleCloseConfirmDialog();
    const userId = localStorage.getItem("userId");
    try {
      await trackingService.updateTracking(id, "CANCELLED");
      navigate(`/client/${userId}`);
      alert("El crédito ha sido cancelado exitosamente.");
    } catch (error) {
      console.error("Error al cancelar el crédito:", error);
      alert("Hubo un error al cancelar el crédito.");
    }
  };

  const handleInfoClick = () => {
    const userId = localStorage.getItem("userId");
    navigate(`/client/info/${userId}`);
  }

  return (
    <>
      {/* Título principal */}
      <Grid container justifyContent="center" sx={{ marginTop: 4 }}>
        <Typography variant="h3" gutterBottom>
          Información del Crédito
        </Typography>
      </Grid>
  
      {/* Contenedor principal */}
      <Grid container spacing={2}>
      {/* Columna izquierda: Información del crédito */}
      <Grid item xs={12} md={6}>
        {creditInfo && tracking ? (
          <CreditInfo creditInfo={creditInfo} tracking={tracking} />
        ) : (
          <Typography variant="body1" color="textSecondary" textAlign="center">
            Cargando la información del crédito...
          </Typography>
        )}
        {tracking  && tracking.message && (
          <Grid item xs={12} marginTop={2}   sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center", 
          }}>
            <Typography
              variant="h7"
              color="textPrimary"
              sx={{
                textAlign: "center",
                marginBottom: 2,
                marginTop: 2,
              }}
            >
              Observaciones a la solicitud:
            </Typography>

            <Box
              sx={{
                border: "1px solid #aaa", // Bordes más oscuros para mayor contraste
                borderRadius: "8px",
                width: "75%",
                padding: 2,
                backgroundColor: "#ffffff", // Fondo blanco para máximo contraste
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Sombra más definida
              }}
            >
              <Typography
                variant="body1"
                color="black" 
                sx={{
                  fontStyle: "italic",
                  textAlign: "justify",
                }}
              >
                {tracking.message}
              </Typography>
            </Box>

          </Grid>

        )}
      </Grid>

  
        {/* Columna derecha: Documentos */}
        <Grid item xs={12} md={6}>
          <Typography variant="body1" color="textSecondary" paragraph>
            Necesitarás subir los siguientes documentos requeridos por la solicitud:
          </Typography>
          {creditInfo && (
            <Documents
              creditId={id}
              creditType={creditInfo.creditType}
              onDocumentChange={fetchTracking}
              needAdditionalDocs={tracking?.state === "PENDINGDOCUMENTATION" && tracking?.message}
            />
          )}
          <Typography variant="body1" color="textPrimary" paragraph sx={{ marginTop: 3 , fontStyle: "italic",}}>
            {tracking && tracking.state === "PENDINGDOCUMENTATION" && !tracking?.message && "Una vez estén subidos todos los documentos, la solicitud pasará a evaluación."}
            {tracking && tracking.state === "PENDINGDOCUMENTATION" && tracking.message && "La solicitud está en espera de la subida de los documentos adicionales."}
            {tracking && tracking.state === "EVALUATING" &&  "Todos los documentos han sido subidos: la solicitud está en evaluación."}
          </Typography>          
        </Grid>
      </Grid>
  

      <Grid container justifyContent="center" spacing={2} sx={{ marginTop: 4 }}>
        {/* Botón de Información Financiera */}
        <Button
          variant="contained"
          color="primary"
          size="medium"
          onClick={handleInfoClick}
          startIcon={<EditIcon />}
          sx={{
            paddingX: 3,
            paddingY: 1,
            maxWidth: "300px",
            "&:hover": {
              backgroundColor: "darkblue",
            },
          }}
        >
          Completar Información Financiera
        </Button>

        {/* Botón de cancelar */}
        <Button
          variant="contained"
          color="error"
          size="medium"
          onClick={() => handleOpenConfirmDialog("cancel")}
          startIcon={<CancelIcon />}
          sx={{
            paddingX: 3,
            paddingY: 1,
            maxWidth: "300px",
            "&:hover": {
              backgroundColor: "darkred",
            },
          }}
        >
          Cancelar Crédito
        </Button>
      </Grid>


        <Grid>
        {/* Diálogo de confirmación */}
        <Dialog
          open={confirmDialogOpen}
          onClose={handleCloseConfirmDialog}
          aria-labelledby="confirmation-dialog-title"
          aria-describedby="confirmation-dialog-description"
        >
          <DialogTitle id="confirmation-dialog-title">
            {dialogAction === "accept"
              ? "Confirmar Aceptación"
              : "Confirmar Cancelación"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="confirmation-dialog-description">
              {dialogAction === "accept"
                ? "¿Estás seguro de que deseas aceptar las condiciones del crédito? Esta acción es irreversible."
                : "¿Estás seguro de que deseas cancelar el crédito? Esta acción es irreversible."}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDialog} color="secondary">
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmAction}
              color={dialogAction === "accept" ? "success" : "error"}
              autoFocus
            >
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>



      </Grid>
    </>
  );
  
};

export default CreditView;
  