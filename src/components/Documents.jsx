import React, { useEffect, useState, useRef } from "react";
import documentService from "../services/document.service";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Grid, Typography, Button } from "@mui/material";
import { List, ListItem, ListItemIcon, Box } from "@mui/material";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { textNeededDocuments } from "./CreditUtils";
import trackingService from "../services/tracking.service";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { set } from "date-fns";


// Mapeo de nombres de tipos de documentos (DocumentType)
const documentTypeMap = {
  "Comprobante de ingresos": "INCOMECERTIFY",
  "Certificado de avalúo": "VALUATIONCERTIFY",
  "Historial crediticio": "CREDITREPORT",
  "Escritura de primera vivienda": "FIRSTHOUSEDEED",
  "Estado financiero del negocio": "FINANCIALSTATUSREPORT",
  "Plan de negocios": "BUSINESSPLAN",
  "Presupuesto de remodelación": "REMODELINGBUDGET",
  "Certificado de avalúo actualizado": "UPDATEDVALUATIONCERTIFY",
};

const Documents = ({ creditId, creditType, onDocumentChange }) => {
  const [documents, setDocuments] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedDocumentLabel, setSelectedDocumentLabel] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  
  const documentTypeMapReversed = Object.fromEntries(
    Object.entries(documentTypeMap).map(([key, value]) => [value, key])
  );

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await documentService.getAllDocumentsByCreditId(creditId);
        setDocuments(response.data || []);
      } catch (err) {
        console.error("Error al obtener los documentos:", err);
        setError("No se pudieron cargar los documentos.");
      }
    };

    fetchDocuments();
  }, [creditId]);

  // Calcular documentos faltantes comparando los subidos con los necesarios
  const neededDocuments = textNeededDocuments(creditType);
  const uploadedDocumentTypes = documents.map((doc) => doc.documentType);
  const missingDocuments = neededDocuments.filter(
    (docLabel) => !uploadedDocumentTypes.includes(documentTypeMap[docLabel])
  );


  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState(null);
  const [newFile, setNewFile] = useState(null);

  const handleEditDocument = async (docId, newFile) => {
    try {
      await documentService.replaceDocument(docId, newFile);
      alert("Documento reemplazado exitosamente.");
      if (onDocumentChange) onDocumentChange();
    } catch (err) {
      console.error("Error al reemplazar documento:", err);
      setError("No se pudo reemplazar el documento.");
    }
  };
  
  const openEditDialog = (docId) => {
    const doc = documents.find((doc) => doc.id === docId);
    if (doc) {
      setDocumentToEdit(doc);
      setIsEditDialogOpen(true);
    } else {
      console.error("No se encontró el documento con ID:", docId);
    }
  };

  const closeEditDialog = () => {
    setDocumentToEdit(null);
    setNewFile(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteClick = (id) => {
    setSelectedDocumentId(id);
    setOpenConfirmDialog(true);
  };
  
  const cancelDelete = () => {
    setOpenConfirmDialog(false);
    setSelectedDocumentId(null);
  };  

  const confirmDelete = async (id) => {
    try {
      await documentService.deleteDocument(id);
      alert("Documento eliminado exitosamente.");
      setDocuments((prev) => prev.filter((doc) => doc.id !== id)); 
      if (onDocumentChange) onDocumentChange();
      setOpenConfirmDialog(false);
    } catch (err) {
      console.error("Error al eliminar documento:", err);
      setError("No se pudo eliminar el documento.");
      setOpenConfirmDialog(false);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    setError("");

    try {
      for (let file of selectedFiles) {
        const documentType = documentTypeMap[selectedDocumentLabel]; // Convierte el nombre humano al tipo enum
        await documentService.save(creditId, documentType, file);
        if (onDocumentChange) onDocumentChange();
      }
      alert("Documento subido exitosamente");
      setSelectedFiles([]); // Limpiar selección
      setSelectedDocumentLabel(""); // Reiniciar selección de tipo de documento

      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }

      const response = await documentService.getAllDocumentsByCreditId(creditId);
      setDocuments(response.data || []);

      const tracking = await trackingService.getTracking(creditId);
      if (tracking.data.state === "EVALUATING") {
          alert("Todos los documentos requeridos están presentes. La solicitud está en evaluación.");
      } 
    } catch (err) {
      console.error("Error al subir documentos:", err);
      setError("No se pudieron subir los documentos.");
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <List>
        {neededDocuments.map((docLabel) => {
          const uploadedDoc = documents.find((doc) => documentTypeMapReversed[doc.documentType] === docLabel);
          const isUploaded = Boolean(uploadedDoc);

          return (
            <ListItem key={docLabel} disableGutters>
              <Grid container alignItems="center">
                {/* Columna: Ícono y Nombre del Documento */}
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center">
                    {isUploaded ? (
                      <CheckCircleIcon color="success" sx={{ marginRight: 1 }} />
                    ) : (
                      <PendingIcon color="warning" sx={{ marginRight: 1 }} />
                    )}
                    <Typography variant="body1">{docLabel}</Typography>
                  </Box>
                </Grid>

                {/* Columna: Botones y Estado */}
                <Grid item xs={6} display="flex" justifyContent="flex-end" alignItems="center">
                  {isUploaded ? (
                    <>
                      <Button
                        variant="contained"
                        color="info"
                        size="small"
                        onClick={() => openEditDialog(uploadedDoc.id)}
                        sx={{ marginRight: 1 }}
                        startIcon={<EditIcon />}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteClick(uploadedDoc.id)}
                        startIcon={<DeleteIcon />}
                      >
                        Borrar
                      </Button>
                    </>
                  ) : (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        textAlign: "center",
                        width: "75%",
                      }}
                    >
                      Pendiente
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </ListItem>
          );
        })}
      </List>



      <Grid container spacing={2} alignItems="center">
        {/* Fila 1: Select y Input de archivo */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="document-type-label">Selecciona el tipo de documento</InputLabel>
            <Select
              labelId="document-type-label"
              value={selectedDocumentLabel}
              onChange={(e) => setSelectedDocumentLabel(e.target.value)}
              displayEmpty
            >
              {missingDocuments.map((docLabel) => (
                <MenuItem key={docLabel} value={docLabel}>
                  {docLabel}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Button
            variant="outlined"
            component="label"
            fullWidth
          >
            Elegir archivo
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileChange}
              ref={fileInputRef}
              hidden
            />
          </Button>
        </Grid>

        {/* Fila 2: Botón de subir documentos */}
        <Grid item xs={12}>     
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            startIcon={<UploadFileIcon />}
            disabled={!selectedFiles.length || !selectedDocumentLabel}
            sx={{ marginTop: 2, marginLeft: "auto", marginRight: "auto",
              display: "flex", 
              flexDirection: "row", 
              alignItems: "center", 
              justifyContent: "center"
             }}
          >
            Subir Documento
          </Button>
          {/* Mostrar el nombre del archivo seleccionado */}
          {selectedFiles.length > 0 && (
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ marginTop: 1, textAlign: "center" }}
            >
              {selectedFiles.map((file) => file.name).join(", ")}
            </Typography>
          )}               
        </Grid>
      </Grid>

      <Dialog open={openConfirmDialog} onClose={cancelDelete}>
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que quieres borrar este documento?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Borrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isEditDialogOpen} onClose={closeEditDialog}>
        <DialogTitle>Editar Documento</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Selecciona un nuevo archivo para reemplazar:
            <br />
            {documentToEdit?.fileName || "Nombre no disponible"}
          </DialogContentText>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setNewFile(e.target.files[0])}
            style={{ marginTop: "16px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancelar</Button>
          <Button
            onClick={() => {
              handleEditDocument(documentToEdit.id, newFile);
              closeEditDialog();
            }}
            disabled={!newFile}
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
        

    </div>
  );
};

export default Documents;
