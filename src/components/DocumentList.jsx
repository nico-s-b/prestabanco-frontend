import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Button from "@mui/material/Button";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Configurar el worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const DocumentList = ({ documents }) => {
  const [pageNumbers, setPageNumbers] = useState({}); // Página actual por documento
  const [validations, setValidations] = useState(0);

  const handlePageChange = (docId, direction) => {
    setPageNumbers((prev) => {
      const currentPage = prev[docId] || 1;
      const nextPage = direction === "next" ? currentPage + 1 : currentPage - 1;
      return { ...prev, [docId]: Math.max(1, nextPage) }; // No bajar de 1
    });
  };

  const handleValidate = () => {
    setValidations((prev) => prev + 1);
  };

  return (
    <div>
      <h2>Documentos</h2>
      <p>Validaciones realizadas: {validations}</p>

      {documents && documents.length > 0 ? (
        documents.map((doc) => (
            <div key={doc.id} style={{ marginBottom: "20px", border: "1px solid #ddd", padding: "10px" }}>
            <h3>{doc.documentType}</h3>
            <Document file={{ data: doc.fileData }}>
                <Page pageNumber={pageNumbers[doc.id] || 1} />
            </Document>
            <div>
                <Button
                variant="contained"
                size="small"
                onClick={() => handlePageChange(doc.id, "prev")}
                disabled={(pageNumbers[doc.id] || 1) === 1}
                style={{ marginRight: "10px" }}
                >
                Anterior
                </Button>
                <Button
                variant="contained"
                size="small"
                onClick={() => handlePageChange(doc.id, "next")}
                style={{ marginRight: "10px" }}
                >
                Siguiente
                </Button>
                <Button variant="contained" color="primary" size="small" onClick={handleValidate}>
                Validar
                </Button>
            </div>
            </div>
        ))
        ) : (
        <p>No hay documentos disponibles.</p>
        )}

    </div>
  );
};

export default DocumentList;
