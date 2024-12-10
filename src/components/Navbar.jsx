import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Sidemenu from "./Sidemenu";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import loginService from "../services/login.service";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userName, setUserName] = useState(localStorage.getItem("name") || "");  
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setUserName(localStorage.getItem("name") || "");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const toggleDrawer = (open) => (event) => {
    setOpen(open);
  };

  const handleLoginClick = async () => {
    navigate("/login");
  };

  const handleLogoutClick = () => {
    loginService.logout();
    setIsLoggedIn(false);
    setUserName("");
    navigate("/"); 
  };

  const handleRegisterClick = () => {
    navigate("/register");
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          PrestaBanco: Sistema de Solicitudes de Crédito
          </Typography>

          {isLoggedIn ? (
              <>
              <Typography variant="body1" sx={{ mr: 2 }}>
                Bienvenido, {userName}
              </Typography>
              <Button color="inherit" onClick={handleLogoutClick}>Cerrar sesión</Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={handleLoginClick}>Iniciar sesión</Button>
              <Button color="inherit" onClick={handleRegisterClick}>Registrarse</Button>
            </>              
          )}

        </Toolbar>
      </AppBar>

      <Sidemenu open={open} toggleDrawer={toggleDrawer}></Sidemenu>
    </Box>
  );
}
