import React, { useEffect, useState } from "react";
import { useNavigate , useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import creditService from "../services/credit.service";
import trackingService from "../services/tracking.service";
import Documents from "./Documents";
import CreditInfo from "./CreditInfo";

const CreditView = () => {
  const navigate = useNavigate();
  const [creditInfo, setCreditInfo] = useState(null);
  const { id } = useParams();
  const [tracking, setTracking] = useState(null);

  const fetchTracking = async () => {
    try {
      const trackingResponse = await trackingService.getTracking(id);
      setTracking(trackingResponse.data);
    } catch (error) {
      console.error("Error al actualizar el tracking:", error);
    }
  };

  useEffect(() => {
    const fetchCreditInfo = async () => {
      try {
        const creditResponse = await creditService.getCreditById(id);
        setCreditInfo(creditResponse.data);
        fetchTracking();
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
      {creditInfo && tracking ? (
        <>
        <CreditInfo creditInfo={creditInfo} tracking={tracking} />


    <div>
      <h2>Información financiera</h2>
        <Button 
          variant="contained"
          color="info"
          onClick={handleInfoClick}
          startIcon={<EditIcon />}
        >
          Completa tu Información Financiera
        </Button>
    </div>
    <div>
      <h2>Documentos</h2>
      Sube los documentos requeridos por la solicitud de crédito.
      <Documents creditId={id} creditType={creditInfo.creditType} onDocumentChange={fetchTracking} />
      </div>
    </>
      ) : (
        <p>Cargando la información del crédito...</p>
      )}

    </div>
  );
};

export default CreditView;
  