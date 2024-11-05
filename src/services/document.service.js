import httpClient from "../http-common";
import axios from "axios";

const prestabancoBackendServer = import.meta.env.VITE_PRESTABANCO1_BACKEND_SERVER;
const prestabancoBackendPort = import.meta.env.VITE_PRESTABANCO1_BACKEND_PORT;

const getAllDocuments = () => {
  return httpClient.get('/api/v1/documents/');
};

const getDocumentById = (id) => {
    return httpClient.get(`/api/v1/documents/${id}`);
;}

const getAllDocumentsByCreditId = (id) => {
  return httpClient.get(`/api/v1/documents/credit/${id}`);
};

const httpClientMultipart = axios.create({
  baseURL: `http://${prestabancoBackendServer}:${prestabancoBackendPort}`,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const createOrUpdateDocument = (creditId, documentData) => {
  const formData = new FormData();
  formData.append("documentType", documentData.documentType);
  formData.append("fileData", documentData.fileData);

  return httpClientMultipart.put(`/api/v1/documents/?id=${creditId}`, formData);
};


export default { getAllDocuments,  getDocumentById ,getAllDocumentsByCreditId ,
    createOrUpdateDocument
};