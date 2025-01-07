import React, { useEffect, useState, useRef } from "react";
import documentService from "../services/document.service";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Grid, Typography, Button, Tooltip } from "@mui/material";
import { List, ListItem, ListItemIcon, Box, IconButton } from "@mui/material";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { textNeededDocuments } from "./CreditUtils";
import trackingService from "../services/tracking.service";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { documentTypeMap } from "./CreditUtils";
import { set } from "date-fns";

const Documents = ({ creditId, creditType, onDocumentChange , needAdditionalDocs}) => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const [excedsSize, setExcedsSize] = useState(false);
  const maxFileSize = 5*1024*1024; // 5 MB
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
  if (needAdditionalDocs) {
    missingDocuments.push("Documentos adicionales");
  }

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState(null);
  const [newFile, setNewFile] = useState(null);

  const handleEditDocument = async (docId, newFile) => {
    try {
      setExcedsSize(newFile.size > maxFileSize);
      if (excedsSize) {
        alert("El archivo excede el tamaño máximo permitido.");
        return;
      }
      await documentService.replaceDocument(docId, newFile);
      alert("Documento reemplazado exitosamente.");
      if (onDocumentChange) onDocumentChange();
    } catch (err) {
      console.error("Error al reemplazar documento:", err);
      setError("No se pudo reemplazar el documento.");
      setExcedsSize(false);
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

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);

  const handleDeleteClick = (id) => {
    setSelectedDocumentId(id);
    setOpenConfirmDialog(true);
  };
  
  const cancelDelete = () => {
    setOpenConfirmDialog(false);
    setSelectedDocumentId(null);
  };  

  const confirmDelete = async () => {
    try {
      await documentService.deleteDocument(selectedDocumentId);
      alert("Documento eliminado exitosamente.");
      setDocuments((prev) => prev.filter((doc) => doc.id !== selectedDocumentId)); 
      if (onDocumentChange) onDocumentChange();
      setOpenConfirmDialog(false);
    } catch (err) {
      console.error("Error al eliminar documento:", err);
      setError("No se pudo eliminar el documento.");
      setOpenConfirmDialog(false);
    }
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDocumentLabel, setSelectedDocumentLabel] = useState("");

  const handleUpload = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const documentType = documentTypeMap[selectedDocumentLabel]; // Convierte el nombre humano al tipo enum
      await documentService.save(creditId, documentType, selectedFile);
      if (onDocumentChange) onDocumentChange();
      alert("Documento subido exitosamente");
      setSelectedFile(null); // Limpiar selección
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

  const handleCancelUpload = () => {
    setExcedsSize(false);
    setSelectedFile(null);
    setSelectedDocumentLabel("");
  };

  const handleFileChange = (file) => {
    if (file.type !== "application/pdf") {
      alert("Solo se permiten archivos en formato PDF.");
      return;
    }
    setSelectedFile(file);
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
      <Grid item xs={12} sx={{ textAlign: "center" }}>
        <Typography
          variant="body2"
          sx={{
            fontStyle: "italic",
            color: excedsSize ? "error.main" : "text.secondary", 
          }}
        >
          {!selectedDocumentLabel && "Elige el tipo de documento que deseas subir:"}
          {selectedDocumentLabel && !selectedFile && "Elige un archivo para subir"}
          {selectedDocumentLabel && selectedFile && !excedsSize && "Haz clic en 'Subir Documento' para completar la acción"}
          {excedsSize && "El archivo excede el tamaño máximo permitido. Por favor, elige un archivo más pequeño."}
        </Typography>
        </Grid>

        {/* Fila 1: Select y Input de archivo */}
        <Grid item xs={12} md={6}>
        <FormControl 
          fullWidth 
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: !selectedDocumentLabel ? "#1976d2" : "inherit", 
              },
              "&:hover fieldset": {
                borderColor: !selectedDocumentLabel ? "#115293" : "inherit",
              },
              "&.Mui-focused fieldset": {
                borderColor: !selectedDocumentLabel ? "#115293" : "inherit",
              },
            },
          }}
        >
          <InputLabel id="document-type-label">Selecciona el tipo de documento</InputLabel>
          <Select
            labelId="document-type-label"
            value={selectedDocumentLabel}
            onChange={(e) => {setSelectedDocumentLabel(e.target.value)}}
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
          sx={{
            marginTop: 2,
            backgroundColor: selectedDocumentLabel ? "primary.main" : "inherit",
            color: selectedDocumentLabel ? "white" : "inherit",
            borderColor: selectedDocumentLabel ? "primary.main" : "inherit",
            "&:hover": {
              backgroundColor: selectedDocumentLabel ? "primary.dark" : "inherit",
              borderColor: selectedDocumentLabel ? "primary.dark" : "inherit",
            },
          }}
          disabled={!selectedDocumentLabel}
        >
          Elegir archivo
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const isTooLarge = file.size > maxFileSize;
                setExcedsSize(isTooLarge);
                handleFileChange(file);
                console.log("Tamaño del archivo:", file.size);
                if (isTooLarge) {
                  console.error(`El archivo excede el tamaño máximo permitido de ${maxFileSize} bytes.`);
                }
              }
            }}
            ref={fileInputRef}
            hidden
          />
        </Button>


          {/* Texto del tamaño máximo permitido */}
          <Typography
            variant="caption"
            sx={{ display: "block", marginTop: 1, color: "text.secondary", textAlign: "center" }}
          >
            Tamaño máximo permitido: 5 MB.
          </Typography>

        </Grid>

        {/* Fila 2: Botón de subir documentos */}
        <Grid item xs={12}>     
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            startIcon={<UploadFileIcon />}
            disabled={!selectedFile || !selectedDocumentLabel || excedsSize}
            sx={{ 
              marginTop: 2, 
              marginLeft: "auto", 
              marginRight: "auto",
              display: "flex", 
              flexDirection: "row", 
              alignItems: "center", 
              justifyContent: "center"
            }}
          >
            Subir Documento
          </Button>

          {/* Mostrar el nombre del archivo seleccionado */}
          {selectedFile && (
            <Box 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                marginTop: 1, 
              }}
            >
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ textAlign: "center" }}
              >
                {selectedFile.name}
              </Typography>
              <Tooltip title="Cancelar elección" arrow>
                <IconButton
                  onClick={handleCancelUpload}
                  sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.2)", 
                    color: "error.main", 
                    border: "1px solid rgba(0, 0, 0, 0.1)", 
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.1)", 
                    },
                    width: 24,
                    height: 24,
                    marginLeft: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>

            </Box>
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
