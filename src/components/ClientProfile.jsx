import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import creditService from "../services/credit.service";
import userService from "../services/user.service";
import CreditTable from "./CreditTable";

const ClientProfile = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [credits, setCredits] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response = await userService.getUserById(userId);
          setUserInfo(response.data);
        } catch (error) {
          console.error("Error al obtener la información del usuario:", error);
        }
        try{
          const response = await creditService.getCreditsByClient(userId);
          setCredits(response.data);
        } catch (error) {
          console.error("Error al obtener los créditos del usuario:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleInfoClick = () => {
    const userId = localStorage.getItem("userId");
    navigate(`/client/info/${userId}`);
  }

  const handleEditClick = (id) => {
    navigate(`/credit/${id}`);
  }

  const handleDelete = (id) => {
    navigate(`/credit/edit/${id}`);
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
          <Button 
            variant="contained"
            color="info"
            onClick={handleInfoClick}
            startIcon={<EditIcon />}
            >
              Completar Información Financiera</Button>
          </>
      ) : (
        <p>Cargando la información del usuario...</p>
      )}
  
      <div>
        <CreditTable credits={credits} handleEditClick={handleEditClick} handleDelete={handleDelete} />
      </div>
    </div>
  );
};

export default ClientProfile;