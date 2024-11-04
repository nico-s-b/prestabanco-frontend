import React, { useState,useEffect } from "react";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import creditService from "../services/credit.service";
import Button from "@mui/material/Button";

const CreditRequest = () => {
  const [creditType, setCreditType] = useState("");
  const [loanPeriod, setLoanPeriod] = useState("");
  const [creditMount, setCreditMount] = useState("");
  const [propertyValue, setPropertyValue] = useState("");

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
      const fetchRestrictions = async () => {
        try {
          const response = await creditService.restrictions({
            creditType,
            propertyValue
          });
          setRestrictions(response.data);
          console.log("Restricciones:", { response });
        } catch (error) {
          console.error("Error al obtener restricciones:", error);
        }
      };

      fetchRestrictions();
    }
  }, [isValuesEntered, creditType, propertyValue]);

  const handleChange = () => {
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

  async function handleSubmit(event) {
      event.preventDefault();
      setError("");

      const userId = Number(localStorage.getItem('userId'));
      console.log("userId:", userId);

      try {
        const response = await creditService.request(
          creditType,
          loanPeriod,
          creditMount,
          propertyValue,
          userId
        );
        console.log("Resultado:", { response });
        alert("Completa tu información financiera para continuar con la solicitud de crédito.");
        navigate(`/client/info/${userId}`);
      } catch (error) {
        setError("Error al solicitar el crédito. Verifica los valores ingresados.");
        console.error("Solicitud fallida:", error);
      }
    }
  
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
            onChange={(e) => { setCreditType(e.target.value); handleChange() }} required>
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
            onChange={(e) => { setPropertyValue(e.target.value); handleChange() }}
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
                onChange={(e) => {setLoanPeriod(e.target.value) ; handleChange()}}
                max={restrictions.maxLoanPeriod}
                required
                min="1" />
            </label>
              Valor máximo: {restrictions.maxLoanPeriod}
            <br />
            <label>
              Monto del Crédito:
              <input
                type="number"
                value={creditMount}
                onChange={(e) => {setCreditMount(e.target.value); handleChange()}}
                max={restrictions.maxFinancingMount}
                required
                min="1" />
            </label>
              Valor máximo: {restrictions.maxFinancingMount}
          </>
        ) : (
          <label>
            Ingresa el tipo de crédito y el valor de la propiedad para continuar con la solicitud de crédito.
          </label>
        )}
        
        <br />
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