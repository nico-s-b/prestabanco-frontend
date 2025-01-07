import httpClient from "../http-common";

const getAllClients = () => {
  return httpClient.get('/api/v1/clients/');
};

const getClientById = (id) => {
  return httpClient.get(`/api/v1/clients/${id}`);
};

const updateClients = (id, data) => {
    return httpClient.put(`/api/v1/clients/${id}`, data);
};

const registerClient = (data) => {
  return httpClient.post("/api/v1/clients/", data);
};

const getBirthdate = (id) => {
  return httpClient.get(`/api/v1/clients/${id}/birthdate`);
};

export default { getAllClients,  getClientById , updateClients, registerClient, getBirthdate };