import React, { useState,useEffect } from "react";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import creditService from "../services/credit.service";
import Button from "@mui/material/Button";
import { fetchRestrictions, renderNeededDocuments } from "./CreditUtils";

const CreditRequest = () => {
  const [creditType, setCreditType] = useState("");
  const [loanPeriod, setLoanPeriod] = useState("");
  const [creditMount, setCreditMount] = useState("");
  const [propertyValue, setPropertyValue] = useState("");
  const [annualRate, setAnnualRate] = useState("");

  const [userId, setUserId] = useState(!!localStorage.getItem("userId"));  
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const [isValuesEntered, setIsValuesEntered] = useState(false);
  const [restrictions, setRestrictions] = useState({
    maxLoanPeriod: 0,
    maxFinancingMount: 0
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isValuesEntered) {
      const getRestrictions = async () => {
        try {
          const restrictionsData = await fetchRestrictions(creditType, propertyValue);
          setRestrictions(restrictionsData);
          console.log("Restricciones:", restrictionsData);
        } catch (error) {
          console.error("Error al obtener restricciones:", error);
        }
      };
  
      getRestrictions();
    }
  }, [isValuesEntered, creditType, propertyValue]);

  const handleValueChange = () => {
    if (creditType && propertyValue) {
      setIsValuesEntered(true);
    }
    if (loanPeriod > restrictions.maxLoanPeriod) {
      alert("El periodo de préstamo no puede ser mayor al máximo permitido");
      setLoanPeriod(restrictions.maxLoanPeriod);
    }
    if (creditMount > restrictions.maxFinancingMount) {
      alert("El monto del crédito no puede ser mayor al máximo permitido");
      setCreditMount(restrictions.maxFinancingMount);
    }
  };

  const handleChange = (e, setter) => {
    const { value } = e.target;
    const rawValue = value.replace(/\./g, ""); // Remueve puntos
    setter(rawValue);    
  };

  const handleSlideChange = (e, setValue) => {
    const value = parseFloat(e.target.value);
    setValue(value);
  };

  const formatNumber = (value) => {
    return value ? parseInt(value, 10).toLocaleString("es-CL") : "";
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const userId = Number(localStorage.getItem('userId'));

    try {
      const response = await creditService.request(
        creditType,
        loanPeriod,
        creditMount,
        propertyValue,
        annualRate,
        userId
      );
      console.log("Solicitud exitosa:", response);
      const creditId = response.data.id;
      console.log("Credit ID:", creditId);
      alert("Sube los documentos requeridos para continuar con la solicitud de crédito.");
      navigate(`/credit/${creditId}`);
    } catch (error) {
      setError("Error al solicitar el crédito. Verifica los valores ingresados.");
      console.error("Solicitud fallida:", error);
    }
  };
  
  const handleLoginClick = async () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/client/register");
  };

  return (
    <><div>
      <h1>Solicitud de Crédito</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Tipo de Crédito:
          <select 
            value={creditType} 
            onChange={(e) => { setCreditType(e.target.value); handleValueChange() }} required>
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
            type="text"
            value={formatNumber(propertyValue)}
            onChange={(e) => { handleChange(e, setPropertyValue);handleValueChange()}}
            required
            min="1" />
        </label>
        <br />

        {isValuesEntered ? (
          <>
            <label>
              Período del Préstamo (años):
              <input
                type="number"
                value={loanPeriod}
                onChange={(e) => {setLoanPeriod(e.target.value) ; handleValueChange()}}
                max={restrictions.maxLoanPeriod}
                required
                min="1" />
            </label>
              Valor máximo: {restrictions.maxLoanPeriod}
            <br />
            <label>
              Monto del Crédito:
              <input
                type="text"
                value={creditMount}
                onChange={(e) => { handleChange(e, setCreditMount);handleValueChange()}}
                max={restrictions.maxFinancingMount}
                required
                min="1" />
            </label>
              Valor máximo: {restrictions.maxFinancingMount.toLocaleString("es-CL")}
              <br />
            <label>
              Interés: {restrictions.minAnnualRate}% -
              <input
                type="range"
                value={annualRate}
                onChange={(e) => handleSlideChange(e, setAnnualRate)}
                required
                min={parseFloat(restrictions.minAnnualRate)}
                max={parseFloat(restrictions.maxAnnualRate)}
                step="0.1"/>
              - {restrictions.maxAnnualRate}% , elegido: {annualRate}%
            </label>

          </>
        ) : (
          <label>
            Ingrese el tipo de crédito y el valor de la propiedad para continuar con la solicitud de crédito.
          </label>
        )}
        
        <br />
        <br />
        {creditType && (
          <>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Documentos requeridos:
            </Typography>
            {renderNeededDocuments(creditType)}
          </>
        )}

        <br />
        {isLoggedIn ? (
          <>
            <button type="submit">Solicitar Crédito</button>
          </>
        ) : (
          <br></br>
        )
        
      }
        
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

    </div>
    <div>
    {isLoggedIn ? (
      <>
        <br></br>
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
  
  export default CreditRequest;