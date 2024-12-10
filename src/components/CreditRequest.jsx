import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import creditService from "../services/credit.service";
import Button from "@mui/material/Button";
import CreditForm from "./CreditForm";
import { textNeededDocuments } from "./CreditUtils";

const CreditRequest = () => {
  const [creditType, setCreditType] = useState("");
  const [loanPeriod, setLoanPeriod] = useState("");
  const [creditMount, setCreditMount] = useState("");
  const [propertyValue, setPropertyValue] = useState("");
  const [annualRate, setAnnualRate] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [isValuesEntered, setIsValuesEntered] = useState(false);
  const [restrictions, setRestrictions] = useState({
    maxLoanPeriod: 0,
    maxFinancingMount: 0,
    minAnnualRate: 0,
    maxAnnualRate: 0
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    // Lógica para verificar token y establecer estado de autenticación
  }, []);

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
  }
  
  const handleLoginClick = async () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <><div>
      <h1>Solicitud de Crédito</h1>
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
        <br />
        {creditType && (
          <>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Documentos requeridos:
            </Typography>
            <ul style={{ textAlign: "left" }}>
              {textNeededDocuments(creditType).map((doc, index) => (
                <li key={index}>{doc}</li>
              ))}
            </ul>
          </>
        )}

        <br />
        {isLoggedIn ? (
          <>
            <button type="submit">Solicitar Crédito</button>
          </>
        ) : (
          <br></br>
        )}
        
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
        <Button color="secondary" onClick={handleLoginClick}>Login</Button>
        <Button color="inherit" onClick={handleRegisterClick}>Register</Button>
      </>              
    )}
    </div></>
  );
};

export default CreditRequest;
