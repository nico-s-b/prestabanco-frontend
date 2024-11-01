import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import creditService from "../services/credit.service";
import Button from "@mui/material/Button";

const CreditSimulate = () => {
  const [creditType, setCreditType] = useState("");
  const [loanPeriod, setLoanPeriod] = useState("");
  const [creditMount, setCreditMount] = useState("");
  const [propertyValue, setPropertyValue] = useState("");
  const [simulationResult, setSimulationResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");  
    setSimulationResult(null); 

    try {
      const response = await creditService.simulate(creditType, loanPeriod, creditMount, propertyValue);
      setSimulationResult(response.data);
      console.log("Resultado:", { response });

    } catch (error) {
      setError("Error al simular el crédito. Verifica los valores ingresados.");
      console.error("Simulación fallida:", error);
    }
  };
  
  const handleLoginClick = async () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/client/register");
  };

  const handleRequestClick = () => {
    navigate("/credit/request")
  };

  return (
    <><div>
      <h1>Simulación de Crédito</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Tipo de Crédito:
          <select value={creditType} onChange={(e) => setCreditType(e.target.value)} required>
            <option value="">Seleccionar</option>
            <option value="FIRSTHOME">Primera Vivienda</option>
            <option value="SECONDHOME">Segunda Vivienda</option>
            <option value="COMERCIAL">Comercial</option>
            <option value="REMODELING">Remodelación</option>
          </select>
        </label>
        <br />
        <label>
          Valor de la Propiedad:
          <input
            type="number"
            value={propertyValue}
            onChange={(e) => setPropertyValue(e.target.value)}
            required
            min="1" />
        </label>
        <br />


        <label>
          Período del Préstamo (años):
          <input
            type="number"
            value={loanPeriod}
            onChange={(e) => setLoanPeriod(e.target.value)}
            required
            min="1" />
        </label>
        <br />

        <label>
          Monto del Crédito:
          <input
            type="number"
            value={creditMount}
            onChange={(e) => setCreditMount(e.target.value)}
            required
            min="1" />
        </label>
        <br />
        <br />
        <button type="submit">Simular Crédito</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {simulationResult && (
        <div>
          <h2>Resultado de la Simulación</h2>
          <p>Cuota mínima posible: {simulationResult[0]}</p>
          <p>Cuota máxima posible: {simulationResult[1]}</p>
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
          >Solicitar Crédito</Button>
      </>
    ) : (
      <>
        <Typography variant="body1" sx={{ mr: 2 }}>
          ¿Quieres pedir un crédito? Inicia sesión o registrate con nosotros
        </Typography>
        <Button color="secondary"  onClick={handleLoginClick}>Login</Button>
        <Button color="inherit" onClick={handleRegisterClick}>Register</Button>
      </>              
    )}
    </div></>

  );
  };
  
  export default CreditSimulate;
  