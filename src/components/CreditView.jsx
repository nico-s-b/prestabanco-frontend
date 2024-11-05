import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useNavigate , useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import creditService from "../services/credit.service";
import { getCreditState, getCreditType } from "./CreditUtils";

const CreditView = () => {
  const navigate = useNavigate();
  const [creditInfo, setCreditInfo] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchCreditInfo = async () => {
      console.log("Credit ID:", id);
      try {
        console.log("Credit Info:");
        const response = await creditService.getCreditById(id);
        setCreditInfo(response.data);
        console.log("Credit Info:", response.data);
      } catch (error) {
        console.error("Error al obtener la información del crédito:", error);
      }
    }
    if (id) {
      fetchCreditInfo();
    }
  }, [id]);

  const handleInfoClick = () => {
    const userId = localStorage.getItem("userId");
    navigate(`/client/info/${userId}`);
  }

  return (
    <div>
      <h1>Información del Crédito</h1>
      {creditInfo ? (
        <>
          <div>
            <p>Tipo de crédito: {getCreditType(creditInfo.creditType)}</p>
            <p>Valor de Propiedad: {creditInfo.propertyValue.toLocaleString("es-CL")}</p>
            <p>Monto: {creditInfo.creditMount.toLocaleString("es-CL")}</p>
            <p>Plazo: {creditInfo.loanPeriod} años</p>
            <p>Interés anual: {creditInfo.annualRate} %</p>
            <p>Fecha de solicitud: {format(new Date(creditInfo.requestDate), 'dd-MM-yyyy')}</p>
            <p>Fecha de última actualización: {format(new Date(creditInfo.lastUpdateDate), 'dd-MM-yyyy')}</p>
            <p>Estado de solicitud: {getCreditState(creditInfo.state)}</p>
          </div>
          <Button 
            variant="contained"
            color="info"
            onClick={handleInfoClick}
            startIcon={<EditIcon />}
            >
              Completa tu Información Financiera</Button>
          </>
      ) : (
        <p>Cargando la información del crédito...</p>
      )}

    </div>
  );
};

export default CreditView;
  