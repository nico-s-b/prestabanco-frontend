import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, Button, Box } from "@mui/material";
import LoanRequirementsTable from "./CreditRequeriments.jsx";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLoginClick = async () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/client/register");
  };

  const handleRequestClick = () => {
    navigate("/credit/request")
  };

  const handleSimulateClick = () => {
    navigate("/credit/simulate")
  };  

  return (
    <Grid container direction="column" alignItems="center" spacing={4} sx={{ padding: 4 }}>
      {/* Título */}
      <Grid item xs={12}>
        <Typography variant="h4" align="center" gutterBottom>
          PrestaBanco: Sistema de Solicitudes de Crédito
        </Typography>
      </Grid>

      {/* Botones principales */}
      <Grid item xs={12}>
        {isLoggedIn ? (
          <Box display="flex" justifyContent="center" gap={2}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSimulateClick}
            >
              Simular Crédito
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#1976d2", color: "#fff" }}
              onClick={handleRequestClick}
            >
              Solicitar Crédito
            </Button>
          </Box>
        ) : (
          <Box textAlign="center">
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              ¿Quieres pedir un crédito? Inicia sesión o regístrate con nosotros.
            </Typography>
            <Box display="flex" justifyContent="center" gap={2}>
              <Button variant="contained" color="secondary" onClick={handleLoginClick}>
                Iniciar sesión
              </Button>
              <Button variant="contained" color="info" onClick={handleRegisterClick}>
                Registrarse
              </Button>
            </Box>
          </Box>
        )}
      </Grid>

      {/* Tabla */}
      <Grid item xs={12} sx={{ width: "90%" }}>
        <LoanRequirementsTable />
      </Grid>

      {/* Texto sobre la aplicación */}
      <Grid item xs={12}>
        <Typography variant="body2" align="center" sx={{ marginTop: 4, fontSize: "0.9rem", color: "text.secondary" }}>
          PrestaBanco es una aplicación web para gestionar la petición, evaluación y seguimiento de solicitudes de
          crédito. Esta aplicación ha sido desarrollada usando tecnologías como{" "}
          <a href="https://spring.io/projects/spring-boot" style={{ color: "#1976d2" }}>Spring Boot</a> (para el backend),{" "}
          <a href="https://reactjs.org/" style={{ color: "#1976d2" }}>React</a> (para el Frontend), y{" "}
          <a href="https://www.postgresql.org/" style={{ color: "#1976d2" }}>PostgreSQL</a> (para la base de datos).
        </Typography>
      </Grid>
    </Grid>
  );

  };
  
  export default Home;
  