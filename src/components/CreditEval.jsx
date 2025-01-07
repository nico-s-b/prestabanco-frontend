import React, { useEffect, useState } from "react";
import { useNavigate , useParams } from "react-router-dom";
import { Grid, Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import SaveIcon from '@mui/icons-material/Save';
import CreditInfo from "./CreditInfo";
import creditService from "../services/credit.service";
import evaluationService from "../services/evaluation.service";
import trackingService from "../services/tracking.service";
import documentsService from "../services/document.service";
import EvalRules16 from "./EvalRules16";
import EvalRule7 from "./EvalRule7";
import { use } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

const CreditEval = () => {
  const navigate = useNavigate();
  const { creditId } = useParams();

  const [openDialog, setOpenDialog] = useState(null); // null, "approve", "reject", "pending"
  const [comments, setComments] = useState(""); 
  
  const [clientId, setClientId] = useState(null);
  const [creditInfo, setCreditInfo] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [clientInfo, setClientInfo] = useState(null);
  const [evaluation, setEvaluation] = useState(null);

  const [evaluationData, setEvaluationData] = useState({
    R1: "",
    R2: "",
    R3: "",
    R4: "",
    R5: "",
    R6: "",
    R7: "",
    R7_1: "",
    R7_2: "",
    R7_3: "",
    R7_4: "",
    R7_5: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentView, setCurrentView] = useState("rules16"); // "rules16" o "rule7"

  const toggleView = () => {
    setCurrentView(currentView === "rules16" ? "rule7" : "rules16");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const creditResponse = await creditService.getCreditById(creditId);
        const creditData = creditResponse.data;
        setCreditInfo(creditData);
        setClientId(creditData.clientId);

        const [trackingResponse, documentsResponse, evaluationResponse,  clientInfoResponse ] = await Promise.all([
          trackingService.getTracking(creditId),
          documentsService.getAllDocumentsByCreditId(creditId),
          evaluationService.getEvaluationByCreditId(creditId),
          evaluationService.getClientInfo(creditData.clientId),
        ]);

        setTracking(trackingResponse.data);
        setDocuments(documentsResponse.data || []);
        setEvaluation(evaluationResponse.data);
        setClientInfo(clientInfoResponse.data);

        // Carga inicial de datos en evaluationData
        if (evaluationResponse.data) {
          setEvaluationData({
            R1: evaluationResponse.data.R1 || "",
            R2: evaluationResponse.data.R2 || "",
            R3: evaluationResponse.data.R3 || "",
            R4: evaluationResponse.data.R4 || "",
            R5: evaluationResponse.data.R5 || "",
            R6: evaluationResponse.data.R6 || "",
            R7: evaluationResponse.data.R7 || "",
            R7_1: evaluationResponse.data.R7_1 || "",
            R7_2: evaluationResponse.data.R7_2 || "",
            R7_3: evaluationResponse.data.R7_3 || "",
            R7_4: evaluationResponse.data.R7_4 || "",
            R7_5: evaluationResponse.data.R7_5 || "",
          });
        }
      } catch (err) {
        console.error("Error al obtener información:", err);
        setError("Hubo un error al cargar la información del crédito.");
        console.log("Error value:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (creditId) {
      fetchData();
    }
  }, [creditId]);

  const handleSave = async () => {
    try {
      await evaluationService.updateEvaluation(creditId, evaluationData);
      alert("Evaluación guardada con éxito");
    } catch (error) {
      console.error("Error al guardar la evaluación:", error);
      alert("Error al guardar la evaluación");
    }
  };

  const handleEvaluationChange = (rule, value) => {
    setEvaluationData((prevData) => ({
      ...prevData,
      [rule]: value, // Actualiza solo la regla específica
    }));
  };


  if (isLoading) {
    return <Typography>Cargando información...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  } 

  const handleDownloadDocument = (documentType) => {
    if (typeof document === "undefined") {
      console.error("El entorno no admite manipulación del DOM");
      return;
    }
  
    const documentItem = documents.find((doc) => doc.documentType === documentType);
  
    if (!documentItem) {
      console.error(`Documento con tipo "${documentType}" no encontrado.`);
      alert("Documento no disponible.");
      return;
    }
  
    const byteCharacters = atob(documentItem.fileData); // Decodifica Base64
    const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
  
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${documentItem.documentType}.pdf`; // Usa el tipo como nombre del archivo
    link.click();
  
    console.log(`Descargando documento: ${documentItem.documentType}`);
  };
  
  
  
  const handleClientInfoChange = (field, value) => {
    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue) && parsedValue >= 0) {
      setClientInfo((prevClientInfo) => ({
        ...prevClientInfo,
        [field]: parsedValue,
      }));
    }
  };
  

  const handleApproveClick = async () => {
    try {
      await trackingService.updateTracking(creditId, "PREAPROVAL");
      navigate("/credit/all");
    } catch (error) {
      console.error("Error al aprobar:", error);
    } finally {
      handleCloseDialog();
    }
  };
  
  const handleRejectClick = async () => {
    try {
      await trackingService.updateComments(creditId, comments, "REJECTED");
      navigate("/credit/all");
    } catch (error) {
      console.error("Error al rechazar:", error);
    } finally {
      handleCloseDialog();
    }
  };
  
  const handlePendingClick = async () => {
    try {
      await trackingService.updateComments(creditId, comments, "PENDINGDOCUMENTATION");
      navigate("/credit/all");
    } catch (error) {
      console.error("Error al solicitar más información:", error);
    } finally {
      handleCloseDialog();
    }
  };
  


  const handleOpenDialog = (action) => {
    setOpenDialog(action);
    setComments(""); // Limpia los comentarios al abrir un nuevo diálogo
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(null);
  };
  

return (
  <Grid
    container
    direction="column"
    alignItems="center"
    justifyContent="center"
    spacing={2}
    sx={{ minHeight: "100vh", textAlign: "center" }}
  >
    {/* Título principal */}
      <Grid container justifyContent="center" sx={{ marginTop: 6 }}>
        <Typography variant="h3">
          Evaluación de Crédito
        </Typography>
      </Grid>

    {/* Mensajes de carga o error */}
    <Grid item xs={12} sx={{ width: "100%", maxWidth: 1200 }}>
    {isLoading ? (
      <Typography>Cargando...</Typography>
    ) : error ? (
      <Box textAlign="center">
        <Typography color="error" variant="h6" sx={{ marginBottom: 2 }}>
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/credit/all")}
        >
          Volver a la lista de créditos
        </Button>
      </Box>
      ) : (
        <>
          {/* Renderizar componente según la vista actual */}
          <Box sx={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>
            {currentView === "rules16" ? (
              <EvalRules16
                creditInfo={creditInfo}
                clientInfo={clientInfo}
                evaluationData={evaluationData}
                evaluation={evaluation}
                documents={documents}
                handleEvaluationChange={handleEvaluationChange}
                handleDownloadDocument={handleDownloadDocument}
                handleClientInfoChange={handleClientInfoChange}
                handleOpenDialog={handleOpenDialog}
              />
            ) : (
              <EvalRule7
                creditInfo={creditInfo}
                clientInfo={clientInfo}
                evaluationData={evaluationData}
                documents={documents}
                handleEvaluationChange={handleEvaluationChange}
                handleDownloadDocument={handleDownloadDocument}
                handleClientInfoChange={handleClientInfoChange}
                handleApproveClick={handleApproveClick}
                handleRejectClick={handleRejectClick}
                handlePendingClick={handlePendingClick}              
              />
            )}
          </Box>

          {/* Botones */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center", // Centra el contenido como base
              alignItems: "center",
              marginTop: 2,
              width: "100%",
              maxWidth: 1200,
              position: "relative", // Para permitir posicionamiento absoluto relativo a este contenedor
            }}
          >
            {/* Botón Ir a Regla / Volver a Reglas */}
            <Button
              variant="outlined"
              onClick={toggleView}
              sx={{
                position: "absolute", // Posiciona este botón de manera absoluta
                left: "20%",             // Lo coloca a la izquierda del contenedor
              }}
            >
              {currentView === "rules16" ? "Ir a Regla 7" : "Volver a Reglas 1 a 6"}
            </Button>

            {/* Botón Guardar */}
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSave}
              sx={{
                margin: "0 auto", // Mantiene el botón centrado
              }}
              startIcon={<SaveIcon />}
            >
              Guardar Evaluación
            </Button>
          </Box>


          {/* Información del Crédito */}
          <Grid 
            item 
            xs={12} 
            sx={{ 
              marginTop: 4, 
              maxWidth: "80%", // Limita el ancho máximo al 80% del contenedor padre
              margin: "0 auto", // Centra horizontalmente el contenido
            }}
          >
            <Typography variant="h5" sx={{ marginBottom: 2 }} marginTop={4}>
              Información del Crédito
            </Typography>
            <Box
              sx={{
                width: "100%",          // Asegura que el contenido ocupe todo el ancho permitido
                maxWidth: "800px",      // Define un ancho máximo para la tabla
                margin: "0 auto",       // Centra horizontalmente
                overflowX: "auto",      // Agrega scroll horizontal si es necesario
              }}
            >
              {creditInfo && tracking ? (
                <CreditInfo creditInfo={creditInfo} tracking={tracking} />
              ) : (
                <Typography>Cargando la información del crédito...</Typography>
              )}
            </Box>
          </Grid>

        </>
      )}
    </Grid>

    <Dialog open={!!openDialog} onClose={handleCloseDialog}>
      <DialogTitle>
        {openDialog === "approve" && "Confirmar Aprobación"}
        {openDialog === "reject" && "Confirmar Rechazo"}
        {openDialog === "pending" && "Solicitar Más Información"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {openDialog === "approve" && "¿Estás seguro de aprobar este crédito?"}
          {openDialog === "reject" && "Por favor, proporciona un motivo para rechazar este crédito."}
          {openDialog === "pending" && "Por favor, especifica qué información adicional se necesita."}
        </DialogContentText>
        {(openDialog === "reject" || openDialog === "pending") && (
          <TextField
            autoFocus
            margin="dense"
            label="Comentarios"
            type="text"
            fullWidth
            variant="outlined"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="primary">
          Cancelar
        </Button>
        <Button
          onClick={() => {
            if (openDialog === "approve") handleApproveClick();
            if (openDialog === "reject") handleRejectClick();
            if (openDialog === "pending") handlePendingClick();
          }}
          color="primary"
          variant="contained"
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>

  </Grid>

);

};

export default CreditEval;