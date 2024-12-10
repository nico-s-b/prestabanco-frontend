import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import calculationService from "../services/calculation.service";
import Button from "@mui/material/Button";
import CreditForm from "./CreditForm"; // Importa CreditForm

const CreditSimulate = () => {
  const [creditType, setCreditType] = useState("");
  const [loanPeriod, setLoanPeriod] = useState("");
  const [creditMount, setCreditMount] = useState("");
  const [propertyValue, setPropertyValue] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [simulationResult, setSimulationResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

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

    try {
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

  const handleLoginClick = () => navigate("/login");
  const handleRegisterClick = () => navigate("/register");
  const handleRequestClick = () => navigate("/credit/request");

  return (
    <>
      <div>
        <h1>Simulación de Crédito</h1>
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
            error={error}
          />

          <br />
          <Button variant="contained" color="secondary" type="submit">
            Simular
          </Button>
          <br />
          <br />
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {simulationResult && (
          <div>
            <h2>Resultado de la Simulación</h2>
            <p>Cuota mínima posible: {simulationResult[0].toLocaleString("es-CL")}</p>
            <p>Cuota solicitada: {simulationResult[1].toLocaleString("es-CL")}</p>
            <p>Cuota máxima posible: {simulationResult[2].toLocaleString("es-CL")}</p>
          </div>
        )}
      </div>
      <div>
        {isLoggedIn ? (
          <>
            <Typography variant="body1" sx={{ mr: 2 }}>
              ¿Quieres pedir un crédito?
            </Typography>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#1976d2', color: '#fff' }}
              onClick={handleRequestClick}
            >
              Solicitar Crédito
            </Button>
          </>
        ) : (
          <>
            <Typography variant="body1" sx={{ mr: 2 }}>
              ¿Quieres pedir un crédito? Inicia sesión o regístrate con nosotros
            </Typography>
            <Button color="secondary" onClick={handleLoginClick}>
              Iniciar sesión
            </Button>
            <Button color="inherit" onClick={handleRegisterClick}>
              Registrarse
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default CreditSimulate;
