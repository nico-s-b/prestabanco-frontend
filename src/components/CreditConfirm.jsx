import React, { useEffect, useState , useRef  } from "react";
import { useNavigate , useParams } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import creditService from "../services/credit.service";
import calculationService from "../services/calculation.service";
import trackingService from "../services/tracking.service";
import CreditInfo from "./CreditInfo";
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

const CreditConfirm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [creditInfo, setCreditInfo] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [totalCosts, setTotalCosts] = useState(null);
  const isCalled = useRef(false); // Usar useRef para persistir la bandera

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState(""); 

  const fetchCreditInfo = async () => {
    try {
      const creditResponse = await creditService.getCreditById(id);
      setCreditInfo(creditResponse.data);
    } catch (error) {
      console.error("Error al obtener la información del crédito:", error);
    }
  };

  const fetchTracking = async () => {
    try {
      const trackingResponse = await trackingService.getTracking(id);
      setTracking(trackingResponse.data);
    } catch (error) {
      console.error("Error al actualizar el tracking:", error);
    }
  };

  const fetchOrCalculateTotalCosts = async () => {
    if (isCalled.current) return; // Evitar múltiples llamados
    isCalled.current = true;

    try {
      const costsResponse = await calculationService.getTotalCostsByCreditId(id);
      setTotalCosts(costsResponse.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("No total costs found, calculating...");
        try {
          const calculatedCosts = await calculationService.setTotalCosts(
            id,
            creditInfo.creditType,
            creditInfo.loanPeriod,
            creditInfo.creditMount,
            creditInfo.propertyValue,
            creditInfo.annualRate
          );
          setTotalCosts(calculatedCosts.data);
        } catch (calcError) {
          console.error("Error al calcular los costos totales:", calcError);
        }
      } else {
        console.error("Error al obtener los costos totales:", error);
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchCreditInfo();
    }
  }, [id]);

  useEffect(() => {
    if (creditInfo) {
      fetchTracking();
    }
  }, [creditInfo]);

  useEffect(() => {
    if (creditInfo && tracking) {
      fetchOrCalculateTotalCosts();
    }
  }, [creditInfo, tracking]);
  
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
    if (dialogAction === "accept") {
      try {
        await trackingService.updateTracking(id, "FINALAPROVAL");
        alert("Crédito aprobado exitosamente.");
        navigate("/home");
      } catch (error) {
        console.error("Error al aprobar:", error);
      }
    } else if (dialogAction === "cancel") {
      const userId = localStorage.getItem("userId");
      try {
        await trackingService.updateTracking(id, "CANCELLED");
        navigate(`/client/${userId}`);
        alert("El crédito ha sido cancelado exitosamente.");
      } catch (error) {
        console.error("Error al cancelar el crédito:", error);
        alert("Hubo un error al cancelar el crédito.");
      }
    }
  };


  return (
    <div>
      <Typography variant="h3" gutterBottom sx={{ marginTop: 4 }} align="center">
        Condiciones del Crédito
      </Typography>
      <Typography variant="h8" gutterBottom sx={{ marginTop: 4 }} align="center">
        A continuación se presentan las condiciones del crédito, por favor revisarlas detenidamente antes de aceptar.
        Una vez aceptadas, el crédito será aprobado y se procederá a la firma del contrato.
      </Typography>
      {creditInfo && tracking ? (
        <>
      <Grid container spacing={2} >
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom sx={{ marginTop: 4 }} align="center">
            Información del Crédito
          </Typography>

          <CreditInfo creditInfo={creditInfo} tracking={tracking} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom sx={{ marginTop: 4 }} align="center">
            Condiciones
          </Typography>
      
          {totalCosts ? (
            <><div>
              <TableContainer component={Paper} sx={{ width: "80%", margin: "0 auto" }}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Cuota fija mensual</TableCell>
                      <TableCell>$ {totalCosts.installment.toLocaleString("es-CL")}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Seguro de crédito (mensual)</TableCell>
                      <TableCell>$ {totalCosts.creditInsurance.toLocaleString("es-CL")}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Seguro de incendio (mensual)</TableCell>
                      <TableCell>$ {totalCosts.fireInsurance.toLocaleString("es-CL")}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total mensual</TableCell>
                      <TableCell>$ {totalCosts.monthlyTotal.toLocaleString("es-CL")}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Número total de cuotas</TableCell>
                      <TableCell>{creditInfo.loanPeriod*12}</TableCell>
                    </TableRow>                    
                    <TableRow>
                      <TableCell>Gastos administrativos</TableCell>
                      <TableCell>$ {totalCosts.administrativeFee.toLocaleString("es-CL")}</TableCell>
                    </TableRow>                    
                    <TableRow>
                      <TableCell>Total final</TableCell>
                      <TableCell>$ {totalCosts.finalTotal.toLocaleString("es-CL")}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fecha de cálculo</TableCell>
                      <TableCell>{new Date(totalCosts.calculationDate).toLocaleString("es-CL")}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            <Grid container justifyContent="center" sx={{ marginTop: 4, gap: 2 }}>
              {/* Botón de aceptar */}
              <Button
                variant="contained"
                color="success"
                size="medium"
                onClick={() => handleOpenConfirmDialog("accept")}
                startIcon={<CheckIcon />} 
                sx={{
                  paddingX: 3,
                  paddingY: 1.5,
                  "&:hover": {
                    backgroundColor: "darkgreen",
                  },
                }}
              >
                Aceptar Condiciones
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
                  paddingY: 1.5,
                  "&:hover": {
                    backgroundColor: "darkred",
                  },
                }}
              >
                Cancelar Crédito
              </Button>
            </Grid>

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



          </>
          ) : (
            <p>Cargando los costos totales...</p>
          )}
          </Grid>
      </Grid>
    </>
      ) : (
        <p>Cargando la información del crédito...</p>
      )}

    </div>
  );
};

export default CreditConfirm;
  