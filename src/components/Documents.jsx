import React, { useEffect, useState, useRef } from "react";
import documentService from "../services/document.service";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { textNeededDocuments } from "./CreditUtils";
import trackingService from "../services/tracking.service";

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

  const handleEditClick = async (id) => {
    try {
      const document = await documentService.getDocumentById(id);
      console.log("Editar documento:", document);
      const tracking = await trackingService.getTracking(creditId);
      console.log("Estado de la solicitud:", tracking.data);
      // Aquí puedes implementar la lógica de edición
    } catch (err) {
      console.error("Error al editar documento:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await documentService.deleteDocument(id);
      alert("Documento eliminado exitosamente.");
      setDocuments((prev) => prev.filter((doc) => doc.id !== id)); 
      if (onDocumentChange) onDocumentChange();
    } catch (err) {
      console.error("Error al eliminar documento:", err);
      setError("No se pudo eliminar el documento.");
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
      alert("Documentos subidos exitosamente.");
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
      <h2>Documentos</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <label>Selecciona el tipo de documento:</label>
      <select
        value={selectedDocumentLabel}
        onChange={(e) => setSelectedDocumentLabel(e.target.value)}
      >
        <option value="">Seleccionar tipo de documento</option>
        {missingDocuments.map((docLabel) => (
          <option key={docLabel} value={docLabel}>
            {docLabel}
          </option>
        ))}
      </select>
      
      <input
        type="file"
        accept=".pdf"
        multiple
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!selectedFiles.length || !selectedDocumentLabel}
      >
        Subir Documentos
      </Button>

      <h3>Documentos Actuales</h3>
      {documents.length > 0 ? (
      <ul>
        {documents.map((doc) => (
           <li key={doc.id}>
          {documentTypeMapReversed[doc.documentType] || doc.documentType}
          <Button
             variant="contained"
             color="info"
             size="small"
             onClick={() => handleEditClick(doc.id)}
             style={{ marginLeft: "0.5rem" }}
             startIcon={<EditIcon />}
           >
             Editar
           </Button>
           <Button
             variant="contained"
             color="error"
             size="small"
             onClick={() => handleDelete(doc.id)}
             style={{ marginLeft: "0.5rem" }}
             startIcon={<DeleteIcon />}
           >
             Borrar
           </Button>
         </li>     
        ))}
      </ul>
        ) : (
          <p>No hay documentos subidos.</p>
        )}

      <h3>Documentos Necesarios</h3>
      {missingDocuments.length > 0 ? (
        <ul>
          {missingDocuments.map((docLabel) => (
            <li key={docLabel}>{docLabel}</li>
          ))}
        </ul>
      ) : (
        <p>Todos los documentos requeridos están subidos.</p>
      )}
    </div>
  );
};

export default Documents;
