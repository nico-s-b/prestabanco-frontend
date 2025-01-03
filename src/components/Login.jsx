import React, { useState, useContext } from "react";
import loginService from "../services/login.service";
import { useNavigate } from "react-router-dom";
import { Grid, TextField, Button, Typography, Select, MenuItem , Box } from "@mui/material";
import { SessionContext } from "../services/SessionContext";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("CLIENT");  
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setIsLoggedIn, setUserName } = useContext(SessionContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const data = { email, password, userType };
    try {
      const response = await loginService.login(data, userType);
      console.log("Login exitoso:", response.data);

        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("Token no encontrado en localStorage");
        }

        const currentUserResponse = await loginService.currentUser();


        localStorage.setItem('userId', currentUserResponse.data.userId);
        localStorage.setItem('name', currentUserResponse.data.name);
        setIsLoggedIn(true);
        setUserName(currentUserResponse.data.name);
        //window.dispatchEvent(new Event("storage"));
        navigate("/home");
      
    } catch (error) {
      const errorMessage = error.response && error.response.data 
                           ? error.response.data.error || "Error en la autenticación" 
                           : "Error en la autenticación";
      setError(errorMessage);    }
  };

  return (
    <Box
    sx={{
      backgroundColor: "rgba(48, 47, 47, 0.8)",
      padding: 4,
      borderRadius: 2,
      boxShadow: 3,
      maxWidth: 400, 
      margin: "auto", 
      marginTop: 8, 
    }}
  >
    <Typography variant="h6" align="center" gutterBottom>
      Ingresa tus credenciales
    </Typography>
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2} direction="column" alignItems="center">
        {/* Email */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="email"
            id="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Grid>

        {/* Contraseña */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="password"
            id="password"
            label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Grid>

        {/* Tipo de Usuario */}
        <Grid item xs={12}>
          <Typography variant="body1" gutterBottom>
            Tipo de Usuario:
          </Typography>
          <Select
            fullWidth
            id="userType"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            required
          >
            <MenuItem value="CLIENT">Cliente</MenuItem>
            <MenuItem value="EXECUTIVE">Ejecutivo</MenuItem>
          </Select>
        </Grid>

        {/* Botón de Login */}
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
          >
            INICIAR SESIÓN
          </Button>
        </Grid>

        {/* Mensaje de error */}
        {error && (
          <Grid item xs={12}>
            <Typography color="error" align="center">
              {error}
            </Typography>
          </Grid>
        )}
      </Grid>
    </form>
  </Box>
  );
};

export default Login;
