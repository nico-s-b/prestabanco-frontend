import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useNavigate , useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import creditService from "../services/credit.service";
import trackingService from "../services/tracking.service";
import { getCreditState, getCreditType } from "./CreditUtils";
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from "@mui/material";
import Documents from "./Documents";

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
        <TableContainer component={Paper} sx={{ width: "60%", margin: "0 auto" }}>
         <Table aria-label="credit info table">
          <TableBody>
            <TableRow>
              <TableCell>Tipo de crédito</TableCell>
              <TableCell>{getCreditType(creditInfo.creditType)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Valor de Propiedad</TableCell>
              <TableCell>{creditInfo.propertyValue.toLocaleString("es-CL")}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Monto</TableCell>
              <TableCell>{creditInfo.creditMount.toLocaleString("es-CL")}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Plazo</TableCell>
              <TableCell>{creditInfo.loanPeriod} años</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Interés anual</TableCell>
              <TableCell>{creditInfo.annualRate} %</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Fecha de solicitud</TableCell>
              <TableCell>{format(new Date(creditInfo.requestDate), 'dd-MM-yyyy')}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Fecha de última actualización</TableCell>
              <TableCell>{tracking ? format(new Date(tracking.lastUpdateDate), 'dd-MM-yyyy') : "Cargando..."}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Estado de solicitud</TableCell>
              <TableCell>{tracking ? getCreditState(tracking.state) : "Cargando..."}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

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
  