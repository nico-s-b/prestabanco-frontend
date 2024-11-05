import React from "react";
import documentService from "../services/document.service";

const Documents = (creditType) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState("");



  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const userId = Number(localStorage.getItem('userId'));

    try {
      const response = await documentService.getAllDocumentsByCreditId(
        creditType,
        loanPeriod,
        creditMount,
        propertyValue,
        userId
      );

      alert("Completa tu información financiera para continuar con la solicitud de crédito.");
      navigate(`/client/info/${response.userId}`);
    } catch (error) {
      setError("Error al solicitar el crédito. Verifica los valores ingresados.");
      console.error("Solicitud fallida:", error);
    }
  }

    return (
      <div>
        <h1>Documents</h1>
        <input type="file" accept=".pdf" onChange={(event) => 
          this.setState({ selectedFile: event.target.files[0] })} />
        <button onClick={this.uploadFile} >Upload</button>  
      </div>
    );
  };
  
  export default Documents;
  