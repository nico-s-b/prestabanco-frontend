import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, Button, Box } from "@mui/material";
import LoanRequirementsTable from "./CreditRequeriments.jsx";
import { SessionContext } from "../services/SessionContext";


const Home = () => {
  const { isLoggedIn, setIsLoggedIn  } = useContext(SessionContext);
  const userType = localStorage.getItem("userType");
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

  const handleEvaluateClick = () => {
    navigate("/credit/all")
  }

  return (
    <Grid container direction="column" alignItems="center" spacing={4} sx={{ padding: 4 }}>
      {/* Título */}
      <Grid item xs={12}>
        <Typography variant="h4" align="center" gutterBottom>
          PrestaBanco: Sistema de Solicitudes de Crédito
        </Typography>
      </Grid>
  
      {/* Botones principales */}
      {isLoggedIn && userType === "EXECUTIVE" ? (
        <>
          {/* Evaluar Créditos */}
          <Grid container item xs={12} direction="column" alignItems="center">
            <Typography variant="body1" sx={{ marginBottom: 1, textAlign: "center" }}>
              ¿Necesitas evaluar créditos?
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#66BB6A",
                color: "#fff",
                "&:hover": { backgroundColor: "#388E3C" }, // Verde más oscuro al pasar el mouse
                minWidth: "200px",
              }}
              onClick={handleEvaluateClick}
            >
              Evaluar Créditos
            </Button>
          </Grid>
        </>
      ) : isLoggedIn && userType === "CLIENT" ? (
        <>
        <Grid container item xs={12} spacing={2} justifyContent="center" alignItems="center">
          {/* Simular Crédito */}
          <Grid item xs={12} md={5} container direction="column" alignItems="center">
            <Typography variant="body1" sx={{ marginBottom: 1, textAlign: "center" }}>
              ¿Quieres realizar una simulación?
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#66BB6A",
                color: "#fff",
                "&:hover": { backgroundColor: "#388E3C" }, // Verde más oscuro al pasar el mouse
                minWidth: "200px",
              }}
              onClick={handleSimulateClick}
            >
              Simular Crédito
            </Button>
          </Grid>
      
          {/* Solicitar Crédito */}
          <Grid item xs={12} md={5} container direction="column" alignItems="center">
            <Typography variant="body1" sx={{ marginBottom: 1, textAlign: "center" }}>
              ¿Quieres pedir un crédito?
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#1976D2",
                color: "#fff",
                "&:hover": { backgroundColor: "#115293" }, // Azul más oscuro al pasar el mouse
                minWidth: "200px",
              }}
              onClick={handleRequestClick}
            >
              Solicitar Crédito
            </Button>
          </Grid>
        </Grid>
      </>
      
      
      ) : (
        <Grid item xs={12}>
          <Box textAlign="center">
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              ¿Quieres pedir un crédito? Inicia sesión o regístrate con nosotros.
            </Typography>
            <Box display="flex" justifyContent="center" gap={2}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "#1976D2",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#115293" },
                  minWidth: "150px",
                }}
                onClick={handleLoginClick}
              >
                Iniciar Sesión
              </Button>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "#66BB6A",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#388E3C" },
                  minWidth: "150px",
                }}
                onClick={handleRegisterClick}
              >
                Registrarse
              </Button>
            </Box>
          </Box>
        </Grid>
      )}
  
      {/* Tabla */}
      <Grid item xs={12} sx={{ width: "100%" }}>
      <Typography
          variant="body1"
          sx={{
            textAlign: "center", 
            fontStyle: "italic", 
            marginBottom: 2,
          }}
        >         
          En PrestaBanco ofrecemos créditos para diferentes necesidades.   
          <br />
          A continuación, te presentamos los requisitos de nuestros créditos:
        </Typography>
        <LoanRequirementsTable />
      </Grid>
  
      {/* Texto sobre la aplicación */}
      <Grid item xs={12}>
        <Typography
          variant="body2"
          align="center"
          sx={{ marginTop: 0, fontSize: "0.9rem", color: "text.secondary" }}
        >
          PrestaBanco es una aplicación web para gestionar la petición, evaluación y seguimiento de solicitudes de
          crédito. Esta aplicación ha sido desarrollada usando tecnologías como{" "}
          <a href="https://spring.io/projects/spring-boot" style={{ color: "#1976d2" }}>
            Spring Boot
          </a>{" "}
          (para el backend),{" "}
          <a href="https://reactjs.org/" style={{ color: "#1976d2" }}>
            React
          </a>{" "}
          (para el Frontend), y{" "}
          <a href="https://www.postgresql.org/" style={{ color: "#1976d2" }}>
            PostgreSQL
          </a>{" "}
          (para la base de datos).
        </Typography>
      </Grid>
    </Grid>
  );
  

  };
  
  export default Home;
  