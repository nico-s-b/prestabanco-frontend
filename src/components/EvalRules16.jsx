import React, { useState , useEffect } from "react";
import { Grid, Box, Typography, Select, MenuItem, TextField , Button, Tooltip} from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import calculationService from "../services/calculation.service";
import evaluationService from "../services/evaluation.service";
import clientService from "../services/client.service";
import { set } from "date-fns";

const EvalRules16 = ({ 
  creditInfo, 
  clientInfo, 
  evaluationData, 
  documents, 
  evaluation,
  handleEvaluationChange, 
  handleDownloadDocument, 
  handleClientInfoChange, 
  handleOpenDialog
}) => {
  const [installment, setInstallment] = useState(null);
  const [maxFinancing, setMaxFinancing] = useState(null);
  const [age, setAge] = useState(null);
  const [income, setIncome] = useState(null);
  const [client, setClient] = useState(null);
  const [decisionButtons, setDecisionButtons] = useState(false);
  const [rejectButton, setRejectButton] = useState(false);
  const [approveButton, setApproveButton] = useState(false);

  const percentage35income = income
  ? (income * 0.35).toLocaleString("es-CL", { style: "currency", currency: "CLP" })
  : "$0";
  const percentage50income = income 
  ? (income * 0.5).toLocaleString("es-CL", { style: "currency", currency: "CLP" })
  : "$0";

  const debt = clientInfo.totalDebt + installment;

  useEffect(() => {
    const fetchCalculations = async () => {
      try {
        // Obtener el cliente primero
        const clientResponse = await clientService.getClientById(clientInfo.clientId);
        const clientData = clientResponse.data;
  
        if (!clientData) {
          throw new Error("No se pudo obtener la información del cliente");
        }
  
        setClient(clientData);
  
        const [responseInstallment, responseMaxFinancing, responseAge, responseIncome] = await Promise.all([
          calculationService.getInstallment(creditInfo),
          calculationService.getMaxFinancing(creditInfo),
          evaluationService.getClientAge(clientData, creditInfo), 
          evaluationService.getClientMonthlyIncome(clientInfo.clientId),
        ]);
  
        setInstallment(responseInstallment.data);
        setMaxFinancing(responseMaxFinancing.data);
        setAge(responseAge.data);
        setIncome(responseIncome.data);
  
        console.log("Calculations fetched successfully");
      } catch (error) {
        console.error("Error al obtener cálculos del crédito:", error);
        setInstallment(null);
        setMaxFinancing(null);
        setAge(null);
        setIncome(null);
      }
    };
  
    if (creditInfo && clientInfo && clientInfo.clientId) {
      fetchCalculations();
    }
  }, [creditInfo, clientInfo]);
  
  useEffect(() => {
    console.log(evaluationData);
  
    const verifyEvaluations = () => {
      const ruleRegex = /^R[1-7]$/; // Expresión regular para coincidir con R1, R2, ..., R7
  
      for (const key in evaluationData) {
        if (ruleRegex.test(key) && evaluationData[key] === "PENDING") {
          setDecisionButtons(false);
          setApproveButton(false);
          setRejectButton(false);
          return;
        }
      }
      for (const key in evaluationData) {
        if (ruleRegex.test(key) && evaluationData[key] === "FAIL") {
          setRejectButton(true);
          setApproveButton(false);
          setDecisionButtons(true);
          return;
        }
      }
      setApproveButton(true);
      setRejectButton(false);
      setDecisionButtons(true);
    };
  
    if (evaluationData) {
      verifyEvaluations();
    }
  }, [evaluationData]);
  
  
  return (

    <Box sx={{ flexGrow: 1, padding: 0 }}>
      {/* Subtítulo */}
      <Typography variant="h6" align="center" sx={{ marginBottom: 1 }}>
        Evaluando reglas 1 a 6
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>

      {/* Grilla */}
      <Grid 
        container 
        spacing={1}
        sx={{
          display: "flex",
          justifyContent: "center", // Centra horizontalmente los elementos
          alignItems: "center",     // Centra verticalmente los elementos si es necesario
          maxWidth: "1200px",       // Define un ancho máximo para la grilla
          margin: "0 auto",         // Centra horizontalmente el contenedor en la página
          padding: "16px",          // Agrega espacio interno
          width: "100%",            // Asegura que la grilla use el ancho completo disponible
        }}
      >

        {/* Fila 1 */}
        {/* Regla 1 */}
        <Grid item xs={12} md={6} display="flex" justifyContent="center">
          <Box
            sx={{
              width: "100%",          // Asegura que cada tarjeta use el espacio permitido
              maxWidth: "450px",              
              border: "1px solid #ccc",
              borderRadius: 2,
              padding: 2,
              height: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Primera fila: Título y estado */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Regla 1 - Relación cuota ingreso
              </Typography>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: evaluationData.R1 === "SUCCESS" ? "green" :
                    evaluationData.R1 === "FAIL" ? "red" : "yellow",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#fff",
                  fontSize: "0.8rem",
                }}
              >
                {evaluationData.R1 === "SUCCESS" ? "✓" :
                  evaluationData.R1 === "FAIL" ? "✕" : "!"}
              </Box>
            </Box>

            {/* Segunda fila: Información relevante */}
            <Box sx={{ marginBottom: 1 }}>
              <TextField
                label="Ingreso mensual"
                type="number"
                variant="outlined"
                size="small"
                fullWidth
                value={clientInfo.monthlyIncome || ""}
                onChange={(e) => handleClientInfoChange("monthlyIncome", e.target.value)}
              />
            </Box>
            <Typography variant="body2">
                Cuota mensual: {installment !== null ? `$${installment.toLocaleString("es-CL")}` : "Cargando..."}
            </Typography>            
            <Typography variant="body2">
              35% del ingreso mensual: {percentage35income}
            </Typography>            

            {/* Tercera fila: Selector para el estado */}
            <Box sx={{ marginBottom: 1 }}>
            <Typography variant="body2" marginTop={1} marginBottom={1}>
                ¿Es la cuota menor al 35% del ingreso?</Typography>
              <Select
                value={evaluationData.R1 || "PENDING"}
                onChange={(e) => handleEvaluationChange("R1", e.target.value)} 
                size="small"
                sx={{
                  border: "2px solid #1976d2", // Borde azul
                  borderRadius: "4px",         // Bordes redondeados
                  "&:hover": {
                    borderColor: "#115293",    // Azul más oscuro al pasar el mouse
                  },
                  "&.Mui-focused": {
                    borderColor: "#0d47a1",    // Azul más oscuro al enfocar
                  },
                }}                
              >
                <MenuItem value="PENDING">Pendiente</MenuItem>
                <MenuItem value="SUCCESS">Cumple</MenuItem>
                <MenuItem value="FAIL">No cumple</MenuItem>
              </Select>
            </Box>

            {/* Cuarta fila: Botón para descargar documento */}
            {documents.length > 0 && (
              <Box sx={{ textAlign: "center" }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<FileDownloadIcon />}
                  onClick={() => handleDownloadDocument("INCOMECERTIFY")}
                >
                  Certificado de ingresos
                </Button>
              </Box>
            )}
          </Box>
        </Grid>

        {/* Regla 2 */}
        <Grid item xs={12} md={6} display="flex" justifyContent="center">
        <Box
            sx={{
              width: "100%",          // Asegura que cada tarjeta use el espacio permitido
              maxWidth: "450px",              
              border: "1px solid #ccc",
              borderRadius: 2,
              padding: 2,
              height: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Primera fila: Título y estado */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Regla 2 - Historial crediticio
              </Typography>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: evaluationData.R2 === "SUCCESS" ? "green" :
                    evaluationData.R2 === "FAIL" ? "red" : "yellow",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#fff",
                  fontSize: "0.8rem",
                }}
              >
                {evaluationData.R2 === "SUCCESS" ? "✓" :
                  evaluationData.R2 === "FAIL" ? "✕" : "!"}
              </Box>
            </Box>

            {/* Segunda fila: Información relevante */}
            <Box sx={{ marginBottom: 1 }}>
              <TextField
                label="Monto mensual de deudas"
                type="number"
                variant="outlined"
                size="small"
                fullWidth
                value={clientInfo.totalDebt  || ""}
                onChange={(e) => handleClientInfoChange("totalDebt", e.target.value)}
              />
            </Box>
            <Typography variant="body2">
              {/* Fecha de última deuda */}
              Fecha última deuda:{" "}
              {clientInfo.lastDebtDate
                ? new Date(clientInfo.lastDebtDate).toLocaleDateString("es-CL", { year: "numeric", month: "long", day: "numeric" })
                : "No disponible"}
            </Typography>         
         

            {/* Tercera fila: Selector para el estado */}
            <Box sx={{ marginBottom: 1 }}>
              <Typography variant="body2" marginTop={1} marginBottom={1}>¿Es adecuado el historial crediticio del cliente?</Typography>
              <Select
                value={evaluationData.R2 || "PENDING"}
                onChange={(e) => handleEvaluationChange("R2", e.target.value)} 
                size="small"
                sx={{
                  border: "2px solid #1976d2", // Borde azul
                  borderRadius: "4px",         // Bordes redondeados
                  "&:hover": {
                    borderColor: "#115293",    // Azul más oscuro al pasar el mouse
                  },
                  "&.Mui-focused": {
                    borderColor: "#0d47a1",    // Azul más oscuro al enfocar
                  },
                }}                
              >
                <MenuItem value="PENDING">Pendiente</MenuItem>
                <MenuItem value="SUCCESS">Cumple</MenuItem>
                <MenuItem value="FAIL">No cumple</MenuItem>
              </Select>
            </Box>

            {/* Cuarta fila: Botón para descargar documento */}
            {documents.length > 0 && (
              <Box sx={{ textAlign: "center" }}>
               <Button
                  variant="outlined"
                  size="small"
                  startIcon={<FileDownloadIcon />}
                  onClick={() => handleDownloadDocument("CREDITREPORT")}
                >
                  Historial Crediticio
                </Button>

              </Box>
            )}
          </Box>
        </Grid>

        {/* Fila 2 */}
        {/* Regla 3 */}
        <Grid item xs={12} md={6} display="flex" justifyContent="center">
        <Box
            sx={{
              width: "100%",          // Asegura que cada tarjeta use el espacio permitido
              maxWidth: "450px",              
              border: "1px solid #ccc",
              borderRadius: 2,
              padding: 2,
              height: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Primera fila: Título y estado */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Regla 3 - Estabilidad laboral
              </Typography>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: evaluationData.R3 === "SUCCESS" ? "green" :
                    evaluationData.R3 === "FAIL" ? "red" : "yellow",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#fff",
                  fontSize: "0.8rem",
                }}
              >
                {evaluationData.R3 === "SUCCESS" ? "✓" :
                  evaluationData.R3 === "FAIL" ? "✕" : "!"}
              </Box>
            </Box>

            {/* Segunda fila: Información relevante */}
            <Typography variant="body2">
              ¿Es empleado dependiente?: {clientInfo.isEmployee ? "Sí" : "No"}
            </Typography>

            {clientInfo.isEmployee ? (
              // Mostrar fecha de inicio del trabajo si es empleado dependiente
              <Typography variant="body2">
                Fecha inicio trabajo:{" "}
                {clientInfo.currentJobStartDate
                  ? new Date(clientInfo.currentJobStartDate).toLocaleDateString("es-CL", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "No disponible"}
              </Typography>
            ) : (
              // Mostrar campo de ingresos últimos 2 años si no es dependiente
              <Box sx={{ marginBottom: 1 }}>
                <TextField
                  label="Ingresos últimos 2 años"
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={clientInfo.lastTwoYearIncome || ""}
                  onChange={(e) => handleClientInfoChange("lastTwoYearIncome", e.target.value)}
                />
              </Box>
            )}

            {/* Tercera fila: Selector para el estado */}
            <Box sx={{ marginBottom: 1 }}>
            <Typography variant="body2" marginTop={1} marginBottom={1}>
              {clientInfo.isEmployee
                ? "¿Su antigüedad laboral es de al menos 1 año?"
                : "¿Sus ingresos demuestran estabilidad financiera?"}
            </Typography>

              <Select
                value={evaluationData.R3 || "PENDING"}
                onChange={(e) => handleEvaluationChange("R3", e.target.value)} 
                sx={{
                  border: "2px solid #1976d2", // Borde azul
                  borderRadius: "4px",         // Bordes redondeados
                  "&:hover": {
                    borderColor: "#115293",    // Azul más oscuro al pasar el mouse
                  },
                  "&.Mui-focused": {
                    borderColor: "#0d47a1",    // Azul más oscuro al enfocar
                  },
                }}
                size="small"
              >
                <MenuItem value="PENDING">Pendiente</MenuItem>
                <MenuItem value="SUCCESS">Cumple</MenuItem>
                <MenuItem value="FAIL">No cumple</MenuItem>
              </Select>
            </Box>

            {/* Cuarta fila: Botón para descargar documento */}
            {documents.length > 0 && (
              <Box sx={{ textAlign: "center" }}>
               <Button
                  variant="outlined"
                  size="small"
                  startIcon={<FileDownloadIcon />}
                  onClick={() => handleDownloadDocument("INCOMECERTIFY")}
                >
                  Certificado de ingresos
                </Button>

              </Box>
            )}
          </Box>       
        </Grid>
        
        {/* Regla 4 */}
        <Grid item xs={12} md={6} display="flex" justifyContent="center">
        <Box
            sx={{
              width: "100%",          // Asegura que cada tarjeta use el espacio permitido
              maxWidth: "450px",              
              border: "1px solid #ccc",
              borderRadius: 2,
              padding: 2,
              height: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Primera fila: Título y estado */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Regla 4 - Relación Deuda/Ingreso
              </Typography>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: evaluationData.R4 === "SUCCESS" ? "green" :
                    evaluationData.R4 === "FAIL" ? "red" : "yellow",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#fff",
                  fontSize: "0.8rem",
                }}
              >
                {evaluationData.R4 === "SUCCESS" ? "✓" :
                  evaluationData.R4 === "FAIL" ? "✕" : "!"}
              </Box>
            </Box>

            {/* Segunda fila: Información relevante */}
            <Typography variant="body2">
              50% del ingreso mensual: {percentage50income}
            </Typography>

            <Typography variant="body2">
              Deuda mensual + cuota: {debt.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}
            </Typography>
            
            
            {/* Tercera fila: Selector para el estado */}
            <Box sx={{ marginBottom: 1 }}>
            <Typography variant="body2" marginTop={1} marginBottom={1}>
              ¿Es la deuda total menor al 50% del ingreso?
            </Typography>

              <Select
                value={evaluationData.R4 || "PENDING"}
                onChange={(e) => handleEvaluationChange("R4", e.target.value)} 
                sx={{
                  border: "2px solid #1976d2", // Borde azul
                  borderRadius: "4px",         // Bordes redondeados
                  "&:hover": {
                    borderColor: "#115293",    // Azul más oscuro al pasar el mouse
                  },
                  "&.Mui-focused": {
                    borderColor: "#0d47a1",    // Azul más oscuro al enfocar
                  },
                }}
                size="small"
              >
                <MenuItem value="PENDING">Pendiente</MenuItem>
                <MenuItem value="SUCCESS">Cumple</MenuItem>
                <MenuItem value="FAIL">No cumple</MenuItem>
              </Select>
            </Box>

            {/* Cuarta fila: Botón para descargar documento */}
            {documents.length > 0 && (
              <Box sx={{ textAlign: "center" }}>
               <Button
                  variant="outlined"
                  size="small"
                  startIcon={<FileDownloadIcon />}
                  onClick={() => handleDownloadDocument("INCOMECERTIFY")}
                >
                  Certificado de ingresos
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<FileDownloadIcon />}
                  onClick={() => handleDownloadDocument("CREDITREPORT")}
                >
                  Historial Crediticio
                </Button>                

              </Box>
            )}
          </Box>           
        </Grid>

        {/* Fila 3 */}
        {/* Regla 5 */}
        <Grid item xs={12} md={6} display="flex" justifyContent="center">
        <Box
            sx={{
              width: "100%",          // Asegura que cada tarjeta use el espacio permitido
              maxWidth: "450px",              
              border: "1px solid #ccc",
              borderRadius: 2,
              padding: 2,
              height: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Primera fila: Título y estado */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Regla 5 - Monto de financiamiento
              </Typography>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: evaluationData.R5 === "SUCCESS" ? "green" :
                    evaluationData.R5 === "FAIL" ? "red" : "yellow",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#fff",
                  fontSize: "0.8rem",
                }}
              >
                {evaluationData.R5 === "SUCCESS" ? "✓" :
                  evaluationData.R5 === "FAIL" ? "✕" : "!"}
              </Box>
            </Box>

            {/* Segunda fila: Información relevante */}
            
            <Typography variant="body2">
              Monto solicitado: {creditInfo.creditMount.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}
            </Typography>

            <Typography variant="body2">
              Monto máximo de financiamiento:{" "}
              {maxFinancing !== null
                ? maxFinancing.toLocaleString("es-CL", { style: "currency", currency: "CLP" })
                : "$0"}
            </Typography>

            
            {/* Tercera fila: Selector para el estado */}
            <Box sx={{ marginBottom: 1 }}>
            <Typography variant="body2" marginTop={1} marginBottom={1}>
              ¿Es el monto solicitado menor al monto máximo?
            </Typography>

              <Select
                value={evaluationData.R5 || "PENDING"}
                onChange={(e) => handleEvaluationChange("R5", e.target.value)} 
                sx={{
                  border: "2px solid #1976d2", // Borde azul
                  borderRadius: "4px",         // Bordes redondeados
                  "&:hover": {
                    borderColor: "#115293",    // Azul más oscuro al pasar el mouse
                  },
                  "&.Mui-focused": {
                    borderColor: "#0d47a1",    // Azul más oscuro al enfocar
                  },
                }}
                size="small"
              >
                <MenuItem value="PENDING">Pendiente</MenuItem>
                <MenuItem value="SUCCESS">Cumple</MenuItem>
                <MenuItem value="FAIL">No cumple</MenuItem>
              </Select>
            </Box>
          </Box>           
        </Grid>

        {/* Regla 6 */}
        <Grid item xs={12} md={6} display="flex" justifyContent="center">
        <Box
            sx={{
              width: "100%",          // Asegura que cada tarjeta use el espacio permitido
              maxWidth: "450px",              
              border: "1px solid #ccc",
              borderRadius: 2,
              padding: 2,
              height: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Primera fila: Título y estado */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Regla 6 - Edad del cliente
              </Typography>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: evaluationData.R6 === "SUCCESS" ? "green" :
                    evaluationData.R6 === "FAIL" ? "red" : "yellow",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#fff",
                  fontSize: "0.8rem",
                }}
              >
                {evaluationData.R6 === "SUCCESS" ? "✓" :
                  evaluationData.R6 === "FAIL" ? "✕" : "!"}
              </Box>
            </Box>

            {/* Segunda fila: Información relevante */}
            
            <Typography variant="body2">
              Edad del solicitante al término del crédito: {age}
            </Typography>
           
            {/* Tercera fila: Selector para el estado */}
            <Box sx={{ marginBottom: 1 }}>
            <Typography variant="body2" marginTop={1} marginBottom={1}>
              ¿Es la edad menor a 70 años al término del crédito?
            </Typography>

              <Select
                value={evaluationData.R6 || "PENDING"}
                onChange={(e) => handleEvaluationChange("R6", e.target.value)} 
                sx={{
                  border: "2px solid #1976d2", // Borde azul
                  borderRadius: "4px",         // Bordes redondeados
                  "&:hover": {
                    borderColor: "#115293",    // Azul más oscuro al pasar el mouse
                  },
                  "&.Mui-focused": {
                    borderColor: "#0d47a1",    // Azul más oscuro al enfocar
                  },
                }}
                size="small"
              >
                <MenuItem value="PENDING">Pendiente</MenuItem>
                <MenuItem value="SUCCESS">Cumple</MenuItem>
                <MenuItem value="FAIL">No cumple</MenuItem>
              </Select>
            </Box>
          </Box>           
        </Grid>

        {/* Fila 4 */}
        {/* Regla 7 */}
        <Grid item xs={12} md={6} display="flex" justifyContent="center">
        <Box
            sx={{
              width: "100%",          // Asegura que cada tarjeta use el espacio permitido
              maxWidth: "450px",              
              border: "1px solid #ccc",
              borderRadius: 2,
              padding: 2,
              height: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Primera fila: Título y estado */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Regla 7 - Capacidad de ahorro
              </Typography>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: evaluationData.R7 === "SUCCESS" ? "green" :
                    evaluationData.R7 === "FAIL" ? "red" : "yellow",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#fff",
                  fontSize: "0.8rem",
                }}
              >
                {evaluationData.R7 === "SUCCESS" ? "✓" :
                  evaluationData.R7 === "FAIL" ? "✕" : "!"}
              </Box>
            </Box>
        
            {/* Segunda fila: Selector para el estado */}
            <Box sx={{ marginBottom: 1 }}>
            <Typography variant="body2" marginTop={1} marginBottom={1}>
              ¿Es adecuada la capacidad de ahorro del cliente?
            </Typography>

              <Select
                value={evaluationData.R7 || "PENDING"}
                onChange={(e) => handleEvaluationChange("R7", e.target.value)} 
                width="100%"
                sx={{
                  border: "2px solid #1976d2", // Borde azul
                  borderRadius: "4px",         // Bordes redondeados
                  "&:hover": {
                    borderColor: "#115293",    // Azul más oscuro al pasar el mouse
                  },
                  "&.Mui-focused": {
                    borderColor: "#0d47a1",    // Azul más oscuro al enfocar
                  },
                }}                
                size="small"
              >
                <MenuItem value="PENDING">Pendiente</MenuItem>
                <MenuItem value="SUCCESS">Cumple</MenuItem>
                <MenuItem value="FAIL">No cumple</MenuItem>
              </Select>
            </Box>

            {/* Segunda fila: Información relevante */}
            <Typography variant="body2">
              Para evaluar, presiona en Ir a Regla 7
            </Typography>

          </Box>           
        </Grid>
        
        <Grid item xs={12} md={6} display="flex" justifyContent="center">
          <Box 
            sx={{ 
              width: "100%",          // Asegura que cada tarjeta use el espacio permitido
              maxWidth: "450px",              
              border: "1px solid #ccc", 
              borderRadius: 2,
              padding: 2, 
              display: "flex", 
              flexDirection: "column", 
              gap: 0, 
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }} align="center">
              Decisión sobre solicitud:
            </Typography>
            {/* Primera línea de botones */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 2 }}>
              <Tooltip
                title={!approveButton || !decisionButtons 
                  ? "Para pre-aprobar, la solicitud debe cumplir todas las reglas" 
                  : ""}
                placement="top"
              >
                <span> {/* Necesario para que el botón deshabilitado sea accesible */}
                  <Button
                    variant="contained"
                    onClick={() => handleOpenDialog("approve")}
                    sx={{
                      backgroundColor: "green",
                      color: "white",
                      "&:hover": { backgroundColor: "darkgreen" },
                      fontSize: "0.8rem",
                    }}
                    disabled={!approveButton || !decisionButtons}
                  >
                    Pre-aprobar
                  </Button>
                </span>
              </Tooltip>
              <Tooltip
                title={!rejectButton || !decisionButtons 
                  ? "Si una solicitud falla al menos una regla, debe ser rechazada" 
                  : ""}
                placement="top"
              >
                <span>
                  <Button
                    variant="contained"
                    onClick={() => handleOpenDialog("reject")}
                    sx={{
                      backgroundColor: "red",
                      color: "white",
                      "&:hover": { backgroundColor: "darkred" },
                      fontSize: "0.8rem",
                    }}
                    disabled={!rejectButton || !decisionButtons}
                  >
                    Rechazar
                  </Button>
                </span>
              </Tooltip>
            </Box>

            {/* Segunda línea: Botón centrado */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Tooltip
                title={!decisionButtons 
                  ? "Todas las reglas deben ser evaluadas antes de poder solicitar más información" 
                  : ""}
                placement="bottom"
              >
                <span>
                  <Button
                    variant="contained"
                    onClick={() => handleOpenDialog("pending")}
                    sx={{
                      backgroundColor: "goldenrod",
                      color: "white",
                      "&:hover": { backgroundColor: "darkgoldenrod" },
                      fontSize: "0.8rem",
                    }}
                    disabled={!decisionButtons}
                  >
                    Solicitar más Información
                  </Button>
                </span>
              </Tooltip>
            </Box>
          </Box>
        </Grid>


      </Grid>
      </Box>

    </Box>
  );
};
export default EvalRules16;