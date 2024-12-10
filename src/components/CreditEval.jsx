import React, { useEffect, useState } from "react";
import { useNavigate , useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import CreditInfo from "./CreditInfo";
import creditService from "../services/credit.service";
import trackingService from "../services/tracking.service";
import clientService from "../services/client.service";
import documentsService from "../services/document.service";
import DocumentList from "./DocumentList";

const CreditEval = () => {
  const navigate = useNavigate();
  const [creditInfo, setCreditInfo] = useState(null);
  const { id } = useParams();
  const [tracking, setTracking] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchCreditInfo = async () => {
      try {
        const creditResponse = await creditService.getCreditById(id);
        setCreditInfo(creditResponse.data);
      } catch (error) {
        console.error("Error al obtener la información del crédito:", error);
      }
    }
    if (id) {
      fetchCreditInfo();
    }
  }, [id]);

  useEffect(() => {
    const fetchTracking = async () => {
      if (!creditInfo) return; 
  
      const clientId = creditInfo.clientId;
  
      try {
        const trackingResponse = await trackingService.getTracking(id);
        setTracking(trackingResponse.data);
      } catch (error) {
        console.error("Error al actualizar el tracking:", error);
      }
  
      try {
        const documentsResponse = await documentsService.getAllDocumentsByCreditId(id);
        setDocuments(documentsResponse.data || []);
      } catch (error) {
        console.error("Error al obtener los documentos:", error);
        setDocuments([]);
      }
      try {
        const userInfoResponse = await clientService.getClientById(clientId);
        setUserInfo(userInfoResponse.data);
      } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
      }
    };
  
    if (creditInfo) {
      fetchTracking(); 
    }
  }, [creditInfo]);

  const handleApproveClick = async () => {
    try {
        await trackingService.updateTracking(id, "PREAPROVAL");
        navigate("/credit/all");
    } catch (error) {
        console.error("Error al aprobar:", error);
    }
};

const handleRejectClick = async () => {
    try {
        await trackingService.updateTracking(id, "REJECTED");
        navigate("/credit/all");
    } catch (error) {
        console.error("Error al rechazar:", error);
    }
};


  return (
    <div>

      <h1>Información del Crédito</h1>
      {creditInfo && tracking ? (
        <>
        <CreditInfo creditInfo={creditInfo} tracking={tracking} />

    <div>
      <h2>Documentos</h2>
      <DocumentList documents={documents} />

    </div>

    <div>
      <h2>Evaluación del crédito</h2>
        <Button 
          variant="contained"
          color="info"
          onClick={handleApproveClick}
          startIcon={<EditIcon />}
        >
          APROBAR
        </Button>

        <Button 
          variant="contained"
          color="error"
          onClick={handleRejectClick}
          startIcon={<EditIcon />}
        >
          RECHAZAR
        </Button>        
    </div>


    </>
      ) : (
        <p>Cargando la información del crédito...</p>
      )}

    </div>
  );
};

export default CreditEval;