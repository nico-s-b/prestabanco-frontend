import { useNavigate } from "react-router-dom";
import { formatISO } from "date-fns";
import React, { useState } from "react";
import clientService from "../services/client.service";
import Button from "@mui/material/Button";
import "./../styles/ClientRegister.css";

const ClientRegister = () => {

  const [data, setData] = useState({
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

    //birthDate formating for backend (ZonedDateTime)
    const formattedData = {
      ...data,
      birthDate: formatISO(new Date(data.birthDate))
    };

    try {
      const response = await clientService.registerClients(formattedData);
      alert("Registro exitoso. Redirigiendo al inicio de sesión...");
      navigate("/login");
    } catch (error) {
      setError("Error al registrar usuario. Verifica los valores ingresados.");
      console.error("Registro fallido:", error);
    }
  };

  return (
    <div className="client-register">
      <br></br>
      <form onSubmit={handleSubmit}>
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
        <Button type="submit">Registrarse</Button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};
  
  export default ClientRegister;