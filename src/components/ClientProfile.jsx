import React, { useEffect, useState } from "react";
import axios from "../http-common";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const ClientProfile = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response = await axios.get(`/api/v1/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setUserInfo(response.data);
        } catch (error) {
          console.error("Error al obtener la información del usuario:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleInfoClick = () => {
    const userId = localStorage.getItem("userId");
    navigate(`/client/info/${userId}`);
  }

  return (
    <div>
      <h1>Client Profile</h1>
      {userInfo ? (
        <>
          <div>
            <p>Nombre: {userInfo.name} {userInfo.paternalLastname} {userInfo.maternalLastname}</p>
            <p>Email: {userInfo.email}</p>
            <p>Teléfono: {userInfo.phone}</p>
            <p>Fecha de Nacimiento: {format(new Date(userInfo.birthDate), 'dd-MM-yyyy')}</p>
            <p>RUT: {userInfo.rut}</p>
          </div>
          <button onClick={handleInfoClick}>Completar Información Financiera</button>
        </>
      ) : (
        <p>Cargando la información del usuario...</p>
      )}
  
      <div>
        {userInfo ? (
          <p>Lista de créditos</p>
        ) : (
          <p>No posee créditos</p>
        )}
      </div>
    </div>
  );
};

export default ClientProfile;