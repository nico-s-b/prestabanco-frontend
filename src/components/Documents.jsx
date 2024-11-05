import React, { useEffect, useState } from "react";
import documentService from "../services/document.service";
import Button from "@mui/material/Button";
import { textNeededDocuments } from "./CreditUtils";
import creditService from "../services/credit.service";

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

const Documents = ({ creditId, creditType }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedDocumentLabel, setSelectedDocumentLabel] = useState("");
  const [error, setError] = useState("");
  const [documents, setDocuments] = useState([]);
  

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
  const currentDocuments = neededDocuments.filter(
    (docLabel) => uploadedDocumentTypes.includes(documentTypeMap[docLabel])
  );

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    setError("");

    try {
      for (let file of selectedFiles) {
        const documentData = {
          documentType: documentTypeMap[selectedDocumentLabel], // Convierte el nombre humano al tipo enum
          fileData: file,
        };
        await documentService.createOrUpdateDocument(creditId, documentData);
      }
      alert("Documentos subidos exitosamente.");
      setSelectedFiles([]); // Limpiar selección
      setSelectedDocumentLabel(""); // Reiniciar selección de tipo de documento

      const response = await documentService.getAllDocumentsByCreditId(creditId);
      setDocuments(response.data || []);

      const validationResponse = await creditService.validateDocs(creditId);
      if (validationResponse.data.state === "EVALUATING") {
          alert("Todos los documentos requeridos están presentes. La solicitud está en evaluación.");
      } else {
          alert("Faltan documentos para completar la solicitud.");
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
      {currentDocuments.length > 0 ? (
      <ul>
        {currentDocuments.map((docLabel) => (
          <li key={docLabel}>{docLabel}</li>
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
