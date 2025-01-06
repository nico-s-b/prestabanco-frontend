import React, { useEffect, useState } from "react";
import { useNavigate , useParams } from "react-router-dom";
import { Grid, Typography, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import creditService from "../services/credit.service";
import trackingService from "../services/tracking.service";
import Documents from "./Documents";
import CreditInfo from "./CreditInfo";

const CreditView = () => {
  const navigate = useNavigate();
  const [creditInfo, setCreditInfo] = useState(null);
  const { id } = useParams();
  const [tracking, setTracking] = useState(null);

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
            <Typography variant="body1" color="textSecondary">
              Cargando la información del crédito...
            </Typography>
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
            />
          )}
          <Typography variant="body1" color="textPrimary" paragraph sx={{ marginTop: 3 , fontStyle: "italic",}}>
            {tracking?.status === "PENDING" ? 
            "Una vez estén subidos todos los documentos, la solicitud pasará a evaluación." : 
            "Todos los documentos han sido subidos: la solicitud está en evaluación."}
          </Typography>          
        </Grid>
      </Grid>
  
      {/* Información financiera */}
      <Grid container justifyContent="center" sx={{ marginTop: 4 }}>
        <Button
          variant="contained"
          color="info"
          onClick={handleInfoClick}
          startIcon={<EditIcon />}
          sx={{ marginTop: 2 }}
        >
          Completa tu Información Financiera
        </Button>
      </Grid>
    </>
  );
  
};

export default CreditView;
  