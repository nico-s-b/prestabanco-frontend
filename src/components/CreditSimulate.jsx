import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import calculationService from "../services/calculation.service";
import { Grid, Button, Typography, Dialog, DialogTitle, DialogContent } from "@mui/material";
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import CreditForm from "./CreditForm";
import { validateValues } from "./CreditUtils";
import RequerimentsDialog from "./CreditRequerimentsDialog";
import { set } from "date-fns";

const CreditSimulate = () => {
  const [creditType, setCreditType] = useState("");
  const [loanPeriod, setLoanPeriod] = useState("");
  const [creditMount, setCreditMount] = useState("");
  const [propertyValue, setPropertyValue] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [fixedAnnualRate, setFixedAnnualRate] = useState("");
  const [simulationResult, setSimulationResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();
  const [isPeriodMountEntered, setIsPeriodMountEntered] = useState(false);
  const [isValuesEntered, setIsValuesEntered] = useState(false);
  const [restrictions, setRestrictions] = useState({
    maxLoanPeriod: 0,
    maxFinancingMount: 0,
    minAnnualRate: 0,
    maxAnnualRate: 0,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSimulationResult(null);
    
    if (validateValues(creditType, loanPeriod, creditMount, propertyValue, annualRate, restrictions, setError)) {
      await simulateCredit();
    } else {
      alert("Error al simular el crédito. Verifica los valores ingresados.");
    }
  };

  const simulateCredit = async () => {
    try {
      setFixedAnnualRate(annualRate);
      const response = await calculationService.simulate(
        creditType,
        loanPeriod,
        creditMount,
        propertyValue,
        annualRate
      );
      setSimulationResult(response.data);
    } catch (error) {
      setError("Error al simular el crédito. Verifica los valores ingresados.");
      console.error("Simulación fallida:", error);
    }
  };

  const handleLoginClick = () => navigate("/login");
  const handleRegisterClick = () => navigate("/register");
  const handleRequestClick = () => {
    navigate("/credit/request", {
      state: {
        creditType,
        loanPeriod,
        creditMount,
        propertyValue,
        annualRate,
      },
    });
  };

  const [openLoanRequirements, setOpenLoanRequirements] = useState(false);

  const handleLoanRequirementsClick = () => {
    setOpenLoanRequirements(true);
  }

  const handleCloseDialog = () => {
    setOpenLoanRequirements(false);
  };

  return (
  <>
    <Grid container justifyContent="center" sx={{ marginTop: 4 }}>
        <Typography variant="h3" gutterBottom>
          Simulación de Crédito
        </Typography>
    </Grid>
    <Grid container spacing={2} >
    {/* Columna izquierda: Formulario */}
      <Grid item xs={12} md={6}>
        <Typography variant="body1" sx={{ mr: 2, marginBottom: 2 }}>
          Completa los siguientes datos para realizar una simulación de crédito:
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
            error={error}
          />
          <Button
            variant="contained"
            color="secondary"
            size="large"
            type="submit"
            fullWidth
            startIcon={<RequestQuoteIcon />}
            sx={{ 
              marginTop: 2,
              width: "50%", 
              marginLeft: "auto", 
              marginRight: "auto",
              display: "flex", 
              flexDirection: "row", 
              alignItems: "center", 
              justifyContent: "center",
            }}
            disabled={!isPeriodMountEntered}
          >
            Simular
          </Button>
        </form>

      {/* Error */}
      {error && (
        <Grid item xs={12} textAlign={"center"}>
          <Typography color="error">{error}</Typography>
        </Grid>
      )}

      </Grid>

      {/* Columna derecha: Resultados de la simulación */}
      <Grid item xs={12} md={6}>
        <div>
          <Typography variant="h6" gutterBottom>
            Resultados de la Simulación de Cuota Mensual
          </Typography>
          {/* Contenedor principal de resultados */}
          <Grid container spacing={1}>
            {/* Fila: Cuota mínima */}
            <Grid item xs={4}>
              <Typography variant="body1"
                sx={{
                  color: simulationResult ? "text.primary" : "text.disabled",
                  opacity: simulationResult ? 1 : 0.5,
                }}              
              >
                Cuota mínima posible:</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography
                variant="body1"
                sx={{
                  color: simulationResult ? "text.primary" : "text.disabled",
                  opacity: simulationResult ? 1 : 0.5,
                }}
              >
                {simulationResult ? `$${simulationResult[0].toLocaleString("es-CL")}` : "—"}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant="body1"
                sx={{
                  color: simulationResult ? "text.primary" : "text.disabled",
                  opacity: simulationResult ? 1 : 0.5,
                }}
              >
                {simulationResult ? `Tasa anual: ${restrictions.minAnnualRate}%` : "—"}
              </Typography>
            </Grid>

            {/* Fila: Cuota solicitada */}
            <Grid item xs={4}>
              <Typography variant="body1"
                sx={{
                  color: simulationResult ? "text.primary" : "text.disabled",
                  opacity: simulationResult ? 1 : 0.5,
                }}              
              >
                Cuota interés escogido:</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography
                variant="body1"
                sx={{
                  color: simulationResult ? "text.primary" : "text.disabled",
                  opacity: simulationResult ? 1 : 0.5,
                }}
              >
                {simulationResult ? `$${simulationResult[1].toLocaleString("es-CL")}` : "—"}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant="body1"
                sx={{
                  color: simulationResult ? "text.primary" : "text.disabled",
                  opacity: simulationResult ? 1 : 0.5,
                }}
              >
                {simulationResult ? `Tasa anual: ${parseFloat(fixedAnnualRate).toFixed(1)}%` : "—"}
              </Typography>
            </Grid>

            {/* Fila: Cuota máxima */}
            <Grid item xs={4}>
              <Typography variant="body1"
                sx={{
                  color: simulationResult ? "text.primary" : "text.disabled",
                  opacity: simulationResult ? 1 : 0.5,
                }}              
              >
                Cuota máxima posible:</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography
                variant="body1"
                sx={{
                  color: simulationResult ? "text.primary" : "text.disabled",
                  opacity: simulationResult ? 1 : 0.5,
                }}
              >
                {simulationResult ? `$${simulationResult[2].toLocaleString("es-CL")}` : "—"}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant="body1"
                sx={{
                  color: simulationResult ? "text.primary" : "text.disabled",
                  opacity: simulationResult ? 1 : 0.5,
                }}
              >
                {simulationResult ? `Tasa anual: ${restrictions.maxAnnualRate}%` : "—"}
              </Typography>
            </Grid>

            {/* Mensaje de ayuda */}
            <Grid item xs={12}>
              <Typography variant="caption" color="textSecondary">
                {simulationResult
                  ? "Los valores presentados son aproximados y pueden variar según las condiciones finales de la solicitud de crédito."
                  : "Para ver los resultados, primero ingrese los valores solicitados y luego presione \"Simular\"."}
              </Typography>
            </Grid>
          </Grid>
        </div>

        {/* Opciones de acción */}
        <Grid item xs={12}>
          {isLoggedIn && simulationResult && (
            <Grid container sx={{ marginTop: 4 }}>
              <Grid container justifyContent="center" >
                <Typography variant="body1" sx={{ mb: 2 }}>
                  ¿Quieres solicitar un crédito usando estos datos?
                </Typography>
              </Grid>
              <Grid container justifyContent="center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRequestClick}
                >
                  Solicitar Crédito
                </Button>
              </Grid>
            </Grid>
          )}

          {!isLoggedIn && (
            <Grid container direction="column" alignItems="center" sx={{ marginTop: 4 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                ¿Quieres pedir un crédito? Inicia sesión o regístrate con nosotros
              </Typography>
              <Button
                color="secondary"
                variant="outlined"
                onClick={handleLoginClick}
                sx={{ marginBottom: 1 }}
              >
                Iniciar sesión
              </Button>
              <Button color="inherit" variant="outlined" onClick={handleRegisterClick}>
                Registrarse
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>

    {/* Cuadro de diálogo de requerimientos */}
    <RequerimentsDialog />

  </>
  );
};

export default CreditSimulate;
