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

const registerClients = (data) => {
    return httpClient.post('/api/v1/clients/', data);
}

export default { getAllClients,  getClientById , updateClients ,registerClients};