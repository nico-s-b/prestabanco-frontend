import httpClient from "../http-common";

const getAllDocuments = () => {
  return httpClient.get('/api/v1/documents/');
};

const getDocumentById = (id) => {
    return httpClient.get(`/api/v1/documents/${id}`);
;}

const getAllDocumentsByCreditId = (id) => {
  return httpClient.get(`/api/v1/documents/credit/${id}`);
};

const createOrUpdateDocument = (creditId, documentData) => {
  const formData = new FormData();
  formData.append("documentType", documentData.documentType);
  formData.append("fileData", documentData.fileData);

  return httpClient.put(`/api/v1/documents/?id=${creditId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


export default { getAllDocuments,  getDocumentById ,getAllDocumentsByCreditId ,
    createOrUpdateDocument
};