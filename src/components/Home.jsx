import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import creditService from "../services/credit.service";
import Button from "@mui/material/Button";

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
      <><div>
        <h1>PrestaBanco: Sistema de Solicitudes de Crédito</h1>
        <p>
          PrestaBanco es una aplicación web para gestionar la petición, evaluación y
          seguimiento de solicitudes de crédito. Esta aplicación ha sido desarrollada
          usando tecnologías como{" "}
          <a href="https://spring.io/projects/spring-boot">Spring Boot</a> (para
          el backend), <a href="https://reactjs.org/">React</a> (para el Frontend)
          y <a href="https://www.postgresql.org/">PostgreSQL</a> (para la
          base de datos).
        </p>
      </div><div>
          {isLoggedIn ? (
            <><>
              <Typography variant="body1" sx={{ mr: 2 }}>
                ¿Quieres simular un crédito?
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSimulateClick}
              >
                Simular Crédito
              </Button>
            </><>
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
              </></>
          ) : (
            <>
              <Typography variant="body1" sx={{ mr: 2 }}>
                ¿Quieres pedir un crédito? Inicia sesión o registrate con nosotros
              </Typography>
              <Button variant="contained" color="secondary" onClick={handleLoginClick}>Iniciar sesión</Button>
              <Button variant="contained" color="info" onClick={handleRegisterClick}>Registrarse</Button>
            </>
          )}
        </div></>

    );
  };
  
  export default Home;
  