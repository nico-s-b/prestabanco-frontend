import httpClient from "../http-common";

const getAllDocuments = () => {
  return httpClient.get('/api/v1/documents/');
};

const getDocumentById = (id) => {
    return httpClient.get(`/api/v1/documents/${id}`);
;}

const getAllDocumentsByCreditId = (id) => {
  return httpClient.get(`/api/v1/documents/credits/${id}`);
};

const createOrUpdateDocument = (creditId, documentData) => {
    const formData = new FormData();
    formData.append("documentType", documentData.documentType);
    formData.append("fileData", documentData.fileData); 
    formData.append("id", creditId); 
    
    return httpClient.put('/api/v1/documents/', formData, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });
  };

export default { getAllDocuments,  getDocumentById ,getAllDocumentsByCreditId ,
    createOrUpdateDocument
};