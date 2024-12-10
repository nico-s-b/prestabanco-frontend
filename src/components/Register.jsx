import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import React, { useState } from "react";
import clientService from "../services/client.service";
import executiveService from "../services/executive.service";
import Button from "@mui/material/Button";
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
      <br />
      <form onSubmit={handleSubmit}>
        <label>Tipo de Usuario:</label>
        <select
          name="userType"
          value={data.userType}
          onChange={handleChange}
          required
        >
          <option value="CLIENT">Cliente</option>
          <option value="EXECUTIVE">Ejecutivo</option>
        </select>
        <input
          type="text"
          name="rut"
          value={data.rut}
          onChange={handleChange}
          placeholder="RUT"
          required
        />
        <input
          type="text"
          name="name"
          value={data.name}
          onChange={handleChange}
          placeholder="Nombre"
          required
        />
        <input
          type="text"
          name="paternalLastname"
          value={data.paternalLastname}
          onChange={handleChange}
          placeholder="Apellido Paterno"
          required
        />
        <input
          type="text"
          name="maternalLastname"
          value={data.maternalLastname}
          onChange={handleChange}
          placeholder="Apellido Materno"
          required
        />
        <input
          type="email"
          name="email"
          value={data.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="phone"
          value={data.phone}
          onChange={handleChange}
          placeholder="Teléfono"
          required
        />
        <input
          type="date"
          name="birthDate"
          value={data.birthDate}
          onChange={handleChange}
          placeholder="Fecha de Nacimiento"
          required
        />
        <input
          type="password"
          name="pass"
          value={data.pass}
          onChange={handleChange}
          placeholder="Contraseña"
          required
        />
        <Button  type="submit">Registrarse</Button >
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default UserRegister;