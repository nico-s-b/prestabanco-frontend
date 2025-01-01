import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import calculationService from "../services/calculation.service";
import { Grid, Typography, Button } from "@mui/material";
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import CreditForm from "./CreditForm";
import { G } from "@react-pdf/renderer";

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
    
    if (validateValues()) {
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
      console.log("Resultado:", { response });
    } catch (error) {
      setError("Error al simular el crédito. Verifica los valores ingresados.");
      console.error("Simulación fallida:", error);
    }
  };


  const validateValues = () => {
    if (creditType && loanPeriod && creditMount && propertyValue && annualRate) {
      if (creditMount > restrictions.maxFinancingMount) {
        setError("El monto solicitado supera el valor máximo permitido.");
        return false;
      }
      if (loanPeriod > restrictions.maxLoanPeriod) {
        setError("El plazo solicitado supera el valor máximo permitido.");
        return false;
      }
      if (annualRate < restrictions.minAnnualRate || annualRate > restrictions.maxAnnualRate) {
        setError("La tasa de interés solicitada no está dentro del rango permitido.");
        return false;
      }
      return true;
    } else {
      setError("Debes completar todos los campos para simular un crédito.");
      return false;
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
            Resultados de la Simulación
          </Typography>
          {/* Contenedor principal de resultados */}
          <Grid container spacing={1}>
            {/* Fila: Cuota mínima */}
            <Grid item xs={4}>
              <Typography variant="body1">Cuota mínima posible:</Typography>
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
              <Typography variant="body1">Cuota solicitada:</Typography>
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
                {simulationResult ? `Tasa anual: ${fixedAnnualRate}%` : "—"}
              </Typography>
            </Grid>

            {/* Fila: Cuota máxima */}
            <Grid item xs={4}>
              <Typography variant="body1">Cuota máxima posible:</Typography>
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
                  : "Ingrese los valores solicitados para simular un crédito."}
              </Typography>
            </Grid>
          </Grid>
        </div>

        {/* Opciones de acción */}
        <Grid item xs={12}>
          {isLoggedIn && simulationResult && (
            <Grid container sx={{ marginTop: 4 }}>
              <Grid container justifyContent="center" xs={12}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  ¿Quieres solicitar un crédito usando estos datos?
                </Typography>
              </Grid>
              <Grid container justifyContent="center" xs={12}>
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
  </>
  );
};

export default CreditSimulate;
