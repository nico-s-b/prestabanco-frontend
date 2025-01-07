import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import creditService from "../services/credit.service";
import { Grid, Typography, Button } from "@mui/material";
import CreditForm from "./CreditForm";
import { textNeededDocuments } from "./CreditUtils";
import SearchIcon from '@mui/icons-material/Search';
import { List, ListItem, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import { getCreditType } from "./CreditUtils";
import { documentDescriptions, validateValues } from "./CreditUtils";
import RequerimentsDialog from "./CreditRequerimentsDialog";
import AddCardIcon from '@mui/icons-material/AddCard';

const CreditRequest = () => {
  const [creditType, setCreditType] = useState("");
  const [loanPeriod, setLoanPeriod] = useState("");
  const [creditMount, setCreditMount] = useState("");
  const [propertyValue, setPropertyValue] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [userId, setUserId] = useState(localStorage.getItem('userId')); 
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [isValuesEntered, setIsValuesEntered] = useState(false);
  const [isPeriodMountEntered, setIsPeriodMountEntered] = useState(false);
  const [restrictions, setRestrictions] = useState({
    maxLoanPeriod: 0,
    maxFinancingMount: 0,
    minAnnualRate: 0,
    maxAnnualRate: 0
  });
  const location = useLocation();
  const initialValues = location.state || {};
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!userId) {
      setError("Debes iniciar sesión para solicitar un crédito.");
      return;
    }

    if (validateValues(creditType, loanPeriod, creditMount, propertyValue, annualRate, restrictions, setError)) {
      setOpenConfirmDialog(true);
    } else {
      alert("Error al simular el crédito. Verifica los valores ingresados.");
    }
  };

  const confirmRequest = async () => {
    try {
      const response = await creditService.request(
        creditType,
        loanPeriod,
        creditMount,
        propertyValue,
        annualRate,
        userId
      );
      const creditId = response.data.id;
      alert("Solicitud de crédito creada exitosamente. Redirigiendo al crédito...");
      navigate(`/credit/${creditId}`);
    } catch (error) {
      setError("No se pudo realizar la solicitud de crédito. Inténtalo nuevamente.");
      console.error("Solicitud fallida:", error);
    } finally {
      setOpenConfirmDialog(false);
    }
  };

  const cancelRequest = () => {
    setOpenConfirmDialog(false);
  };
  
  const handleLoginClick = async () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <>
      <Grid container justifyContent="center" sx={{ marginTop: 4 }}>
        <Typography variant="h3" gutterBottom>
          Solicitud de Crédito
        </Typography>
      </Grid>

      <Grid container spacing={2} >
      {/* Columna izquierda: Formulario */}
        <Grid item xs={12} md={6}>
          <Typography variant="body1" sx={{ mr: 2, marginBottom: 2 }}>
            Completa los siguientes datos para solicitar un crédito:
          </Typography>
          <form onSubmit={handleSubmit}>
            <CreditForm
              creditType={creditType}
              setCreditType={setCreditType}
              loanPeriod={loanPeriod}
              setLoanPeriod={setLoanPeriod}
              creditMount={creditMount}
              setCreditMount={setCreditMount}
              propertyValue={propertyValue}
              setPropertyValue={setPropertyValue}
              annualRate={annualRate}
              setAnnualRate={setAnnualRate}
              restrictions={restrictions}
              setRestrictions={setRestrictions}
              isValuesEntered={isValuesEntered}
              setIsValuesEntered={setIsValuesEntered}
              isPeriodMountEntered={isPeriodMountEntered}
              setIsPeriodMountEntered={setIsPeriodMountEntered}
              initialValues={initialValues}
              isLoggedIn={isLoggedIn}
              isRequest={true}
            />
            
          <Grid container direction="column" alignItems="center">
            {isLoggedIn && (
              <>
                <Grid item>
                  <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    size="large"
                    startIcon={<AddCardIcon />}
                    sx={{ 
                      marginTop: 2,
                      width: "100%", 
                      marginLeft: "auto", 
                      marginRight: "auto",
                      display: "flex", 
                      flexDirection: "row", 
                      alignItems: "center", 
                      justifyContent: "center",
                    }}
                    disabled={!isPeriodMountEntered}
                  >
                    Crear Solicitud
                  </Button>
                </Grid>
                <Grid item>
                  <Typography
                    variant="caption"
                    align="center"
                    sx={{ marginTop: 1, color: "text.secondary" }}
                  >
                    Luego deberás subir la documentación requerida
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>

          </form>

          {/* Error */}
          {error && (
            <Grid item xs={12} textAlign={"center"}>
              <Typography color="error">{error}</Typography>
            </Grid>
          )}
        </Grid>

      {/* Columna derecha: Documentos */}
      <Grid item xs={12} md={6}>
        {creditType && (
          <>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Después de crear una solicitud, necesitarás los siguientes documentos para continuar el proceso:
            </Typography>
            <List>
              {textNeededDocuments(creditType).map((doc, index) => (
                <ListItem key={index} sx={{ alignItems: "center" }}>
                  <ListItemIcon>
                    <SearchIcon color="primary" />
                  </ListItemIcon>
                  <Tooltip title={documentDescriptions[doc] || "Descripción no disponible"} arrow={false}>
                    <ListItemText primary={doc} />
                  </Tooltip>                  
                </ListItem>
              ))}
            </List>
          </>
        )}
        {!creditType && (
          <Typography variant="body1" sx={{ mr: 2 }}>
            Selecciona un tipo de crédito para ver los documentos requeridos.
          </Typography>
        )}
      </Grid>

    </Grid>

    <div>
    {isLoggedIn ? (
      <>
        <br></br>
      </>
    ) : (
      <>
      <Grid container direction="column" alignItems="center" justifyContent="center" sx={{ marginTop: 4 }}>
        <Grid item>
        <Typography variant="body1" sx={{ mr: 2 }}>
          ¿Quieres pedir un crédito? Inicia sesión o registrate con nosotros
        </Typography>
        </Grid>
        <Grid item>
        <Button color="secondary" onClick={handleLoginClick}>Iniciar sesión</Button>
        <Button color="info" onClick={handleRegisterClick}>Registrarse</Button>
        </Grid>
      </Grid>
      </>              
    )}
    </div>

    <Dialog open={openConfirmDialog} onClose={cancelRequest}>
      <DialogTitle>Confirmar solicitud de crédito</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Estás a punto de crear una solicitud de crédito con los siguientes datos:
        </DialogContentText>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Tipo de crédito:</TableCell>
              <TableCell>{getCreditType(creditType)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Monto solicitado:</TableCell>
              <TableCell>$ {parseInt(creditMount,10).toLocaleString("es-CL")}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Tasa de interés anual:</TableCell>
              <TableCell>{parseFloat(annualRate).toFixed(1)}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Plazo:</TableCell>
              <TableCell>{loanPeriod} años</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <DialogContentText sx={{ marginTop: 2 }}>
          Recuerda que deberás subir la documentación requerida para continuar con tu solicitud.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={confirmRequest} color="primary" variant="contained">
          Confirmar solicitud
        </Button>
        <Button onClick={cancelRequest} color="secondary" variant="outlined">
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>

    {/* Cuadro de diálogo de requerimientos */}
    <RequerimentsDialog />

  </>
  );
};

export default CreditRequest;
