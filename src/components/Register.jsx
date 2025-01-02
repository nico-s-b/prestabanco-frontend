import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import React, { useState } from "react";
import clientService from "../services/client.service";
import executiveService from "../services/executive.service";
import { Grid, TextField, Select, MenuItem, Button, Typography } from "@mui/material";
import "./../styles/Register.css";

const UserRegister = () => {
  const [data, setData] = useState({
    userType: "CLIENT", // Por defecto, será "CLIENT"
    rut: "",
    name: "",
    paternalLastname: "",
    maternalLastname: "",
    email: "",
    phone: "",
    birthDate: "",
    pass: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const formattedData = {
      ...data,
      birthDate: format(new Date(data.birthDate), "yyyy-MM-dd'T'HH:mm:ss")
    };

    try {
      const response =
        data.userType === "CLIENT"
          ? await clientService.registerClient(formattedData)
          : await executiveService.registerExecutive(formattedData);
      alert("Registro exitoso. Redirigiendo al inicio de sesión...");
      navigate("/login");
    } catch (error) {
      setError("Error al registrar usuario. Verifica los valores ingresados.");
      console.error("Registro fallido:", error);
    }
  };

  return (
    <div className="user-register">
      <Typography variant="h4" align="center" gutterBottom>
        Registro de Usuario
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} justifyContent="center">
          {/* Tipo de Usuario */}
          <Grid item xs={12} md={6}>

            <TextField
              select
              fullWidth
              label="Tipo de Usuario"
              name="userType"
              value={data.userType}
              onChange={handleChange}
              required
            >
              <MenuItem value="">Seleccionar</MenuItem>
              <MenuItem value="CLIENT">Cliente</MenuItem>
              <MenuItem value="EXECUTIVE">Ejecutivo</MenuItem>
            </TextField>
          </Grid>

          {/* RUT */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="rut"
              value={data.rut}
              onChange={handleChange}
              placeholder="RUT"
              required
              label="RUT"
            />
          </Grid>

          {/* Nombre */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Nombre"
              required
              label="Nombre"
            />
          </Grid>

          {/* Apellido Paterno */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="paternalLastname"
              value={data.paternalLastname}
              onChange={handleChange}
              placeholder="Apellido Paterno"
              required
              label="Apellido Paterno"
            />
          </Grid>

          {/* Apellido Materno */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="maternalLastname"
              value={data.maternalLastname}
              onChange={handleChange}
              placeholder="Apellido Materno"
              required
              label="Apellido Materno"
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Email"
              required
              label="Email"
            />
          </Grid>

          {/* Teléfono */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="phone"
              value={data.phone}
              onChange={handleChange}
              placeholder="Teléfono"
              required
              label="Teléfono"
            />
          </Grid>

          {/* Fecha de Nacimiento */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              name="birthDate"
              value={data.birthDate}
              onChange={handleChange}
              required
              label="Fecha de Nacimiento"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          {/* Contraseña */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="password"
              name="pass"
              value={data.pass}
              onChange={handleChange}
              placeholder="Contraseña"
              required
              label="Contraseña"
            />
          </Grid>

          {/* Botón de Registro */}
          <Grid item xs={12} md={6}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
            >
              Registrarse
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
    </div>
  );
};

export default UserRegister;