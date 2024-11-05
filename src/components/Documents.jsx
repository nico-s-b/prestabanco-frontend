import React, { useEffect, useState } from "react";
import documentService from "../services/document.service";
import Button from "@mui/material/Button";
import { renderNeededDocuments } from "./CreditUtils";

const Documents = ({ creditId, creditType }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState("");
  const [documents, setDocuments] = useState([]);
  const neededDocuments = renderNeededDocuments(creditType);
  console.log("Documentos requeridos:", neededDocuments);

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

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    setError("");

    try {
      for (let file of selectedFiles) {
        const documentData = {
          documentType: "FINANCIAL",
          fileData: file,
        };
        await documentService.createOrUpdateDocument(creditId, documentData);
      }

      alert("Documentos subidos exitosamente.");
      setSelectedFiles([]); // Limpiar selección
      const response = await documentService.getAllDocumentsByCreditId(creditId);
      setDocuments(response.data || []); // Recargar documentos después de subirlos
    } catch (err) {
      console.error("Error al subir documentos:", err);
      setError("No se pudieron subir los documentos.");
    }
  };

  return (
    <div>
      <h2>Documentos</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
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
        disabled={!selectedFiles.length}
      >
        Subir Documentos
      </Button>

      <h3>Documentos Actuales</h3>
      {documents.length > 0 ? (
        <ul>
          {documents.map((doc) => (
            <li key={doc.id}>{doc.documentType}</li>
          ))}
        </ul>
      ) : (
        <p>No hay documentos subidos.</p>
      )}
    </div>
  );
};

export default Documents;
