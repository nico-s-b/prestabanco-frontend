import React, { useEffect, useState } from "react";
import { useNavigate , useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import creditService from "../services/credit.service";
import calculationService from "../services/calculation.service";
import trackingService from "../services/tracking.service";
import CreditInfo from "./CreditInfo";

const CreditConfirm = () => {
  const navigate = useNavigate();
  const [creditInfo, setCreditInfo] = useState(null);
  const { id } = useParams();
  const [tracking, setTracking] = useState(null);
  const [totalCosts, setTotalCosts] = useState(null);
  const fetchCreditInfo = async () => {
    try {
      const creditResponse = await creditService.getCreditById(id);
      setCreditInfo(creditResponse.data);
    } catch (error) {
      console.error("Error al obtener la información del crédito:", error);
    }
  };

  const fetchTracking = async () => {
    try {
      const trackingResponse = await trackingService.getTracking(id);
      setTracking(trackingResponse.data);
    } catch (error) {
      console.error("Error al actualizar el tracking:", error);
    }
  };

  const fetchOrCalculateTotalCosts = async () => {
    try {
      const costsResponse = await calculationService.getTotalCostsByCreditId(id);
      setTotalCosts(costsResponse.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("No total costs found, calculating...");
        try {
          const calculatedCosts = await calculationService.setTotalCosts(
            id,
            creditInfo.creditType,
            creditInfo.loanPeriod,
            creditInfo.creditMount,
            creditInfo.propertyValue,
            creditInfo.annualRate
          );
          setTotalCosts(calculatedCosts.data);
        } catch (calcError) {
          console.error("Error al calcular los costos totales:", calcError);
        }
      } else {
        console.error("Error al obtener los costos totales:", error);
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchCreditInfo();
    }
  }, [id]);

  useEffect(() => {
    if (creditInfo) {
      fetchTracking();
    }
  }, [creditInfo]);

  useEffect(() => {
    if (creditInfo && tracking) {
      fetchOrCalculateTotalCosts();
    }
  }, [creditInfo, tracking]);

  
  const handleAcceptClick = async () => {
    try {
        await trackingService.updateTracking(id, "FINALAPROVAL");
        alert("Crédito aprobado exitosamente.");
        navigate("/home");
    } catch (error) {
        console.error("Error al aprobar:", error);
    }
  };

  const handleCancel = async (id) => {
    const userId = localStorage.getItem("userId");
    try {
      await trackingService.updateTracking(id, "CANCELLED");
      navigate(`/client/${userId}`);
      alert("El crédito ha sido cancelado exitosamente.");
    } catch (error) {
      console.error("Error al cancelar el crédito:", error);
      alert("Hubo un error al cancelar el crédito.");
    }
  };

  return (
    <div>

      <h1>Condiciones del Crédito</h1>
      {creditInfo && tracking ? (
        <>
        <CreditInfo creditInfo={creditInfo} tracking={tracking} />

    <div>
      <h2>Condiciones</h2>
      
      {totalCosts ? (
        <><div>
                <TableContainer component={Paper} sx={{ width: "60%", margin: "0 auto" }}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Cuota</TableCell>
                        <TableCell>{totalCosts.installment.toLocaleString("es-CL")}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Seguro de crédito</TableCell>
                        <TableCell>{totalCosts.creditInsurance.toLocaleString("es-CL")}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Seguro de incendio</TableCell>
                        <TableCell>{totalCosts.fireInsurance.toLocaleString("es-CL")}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Gastos administrativos</TableCell>
                        <TableCell>{totalCosts.administrativeFee.toLocaleString("es-CL")}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total mensual</TableCell>
                        <TableCell>{totalCosts.monthlyTotal.toLocaleString("es-CL")}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total final</TableCell>
                        <TableCell>{totalCosts.finalTotal.toLocaleString("es-CL")}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Fecha de cálculo</TableCell>
                        <TableCell>{new Date(totalCosts.calculationDate).toLocaleString("es-CL")}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <div>
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    onClick={() => handleAcceptClick(id)}
                    style={{ marginLeft: "0.5rem" }}

                  >
                    Aceptar Condiciones
                  </Button>

                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleCancel(id)}
                    style={{ marginLeft: "0.5rem" }}

                  >
                    Cancelar Crédito
                  </Button>                  
                </div></>


      ) : (
        <p>Cargando los costos totales...</p>
      )}


    </div>

    </>
      ) : (
        <p>Cargando la información del crédito...</p>
      )}

    </div>
  );
};

export default CreditConfirm;
  