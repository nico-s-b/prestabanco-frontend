import httpClient from "../http-common";
import axios from "axios";

const prestabancoBackendServer = import.meta.env.VITE_PRESTABANCO1_BACKEND_SERVER;
const prestabancoBackendPort = import.meta.env.VITE_PRESTABANCO1_BACKEND_PORT;

// Necesario para enviar archivos al backend en formato multipart/form-data
const httpClientMultipart = axios.create({
  baseURL: `http://${prestabancoBackendServer}:${prestabancoBackendPort}`,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const save = (creditId, documentType, fileData) => {
  const formData = new FormData();
  formData.append("id", creditId);
  formData.append("documentType", documentType);
  formData.append("fileData", fileData);

  return httpClientMultipart.put(`/api/v1/documents/`, formData);
};

const getAllDocuments = () => {
  return httpClient.get('/api/v1/documents/');
};

const getDocumentById = (id) => {
    return httpClient.get(`/api/v1/documents/${id}`);
;}

const getAllDocumentsByCreditId = (id) => {
  return httpClient.get(`/api/v1/documents/credit/${id}`);
};

const deleteDocument = (id) => {
  return httpClient.delete(`/api/v1/documents/${id}`);
};

const replaceDocument = (id, fileData) => {
  const formData = new FormData();
  formData.append("id", id);
  formData.append("fileData", fileData);

  return httpClientMultipart.put(`/api/v1/documents/replace`, formData);
};

export default { getAllDocuments,  getDocumentById , getAllDocumentsByCreditId ,
    save, deleteDocument, replaceDocument
};