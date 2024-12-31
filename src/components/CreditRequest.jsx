import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import creditService from "../services/credit.service";
import { Grid, Typography, Button } from "@mui/material";
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
    <>
      <Grid container justifyContent="center" sx={{ marginTop: 4 }}>
          <Typography variant="h3" gutterBottom>
            Solicitud de Crédito
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
            initialValues={initialValues}
          />
          
          </form>
        </Grid>

      {/* Columna derecha: Documentos */}
      <Grid item xs={12} md={6}>
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
      </Grid>
    </Grid>

    <Grid container justifyContent="center" sx={{ marginTop: 4 }}>
        {isLoggedIn ? (
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            fullWidth
            sx={{ 
              marginTop: 2,
              width: "20%", 
              marginLeft: "auto", 
              marginRight: "auto",
              display: "block",                             
            }}
            disabled={!isPeriodMountEntered}
          >
            Solicitar Crédito
          </Button>
        ) : (
          <br></br>
        )}
    </Grid>

    <div>
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
