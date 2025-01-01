import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import creditService from "../services/credit.service";
import { Grid, Typography, Button } from "@mui/material";
import CreditForm from "./CreditForm";
import { textNeededDocuments } from "./CreditUtils";
import SearchIcon from '@mui/icons-material/Search';
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

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
    if (!userId) {
      setError("Debes iniciar sesión para solicitar un crédito.");
      return;
    }
    if (validateValues()) {
      await requestCredit();
    } else {
      setError("Error al solicitar el crédito. Verifica los valores ingresados.");
    }
  };
  
  const requestCredit = async () => {
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
      alert("Sube los documentos requeridos para continuar con la solicitud de crédito.");
      navigate(`/credit/${creditId}`);
    } catch (error) {
      setError("Error al solicitar el crédito. Verifica los valores ingresados.");
      console.error("Solicitud fallida:", error);
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
            
          <Grid container direction="column" alignItems="center" sx={{ marginTop: 4 }}>
            {isLoggedIn && (
              <>
                <Grid item>
                  <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    sx={{
                      marginTop: 2,
                      width: "100%",
                      display: "block",
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
                    Luego podrás subir la documentación requerida
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
              Prepara los siguientes documentos para continuar la solicitud:
            </Typography>
            <List>
              {textNeededDocuments(creditType).map((doc, index) => (
                <ListItem key={index} sx={{ alignItems: "center" }}>
                  <ListItemIcon>
                    <SearchIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={doc} />
                </ListItem>
              ))}
            </List>
          </>
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
        <Typography variant="body1" sx={{ mr: 2 }}>
          ¿Quieres pedir un crédito? Inicia sesión o registrate con nosotros
        </Typography>
        <Button color="secondary" onClick={handleLoginClick}>Login</Button>
        <Button color="inherit" onClick={handleRegisterClick}>Register</Button>
      </>              
    )}
    </div>

  </>
  );
};

export default CreditRequest;
