import httpClient from "../http-common";

const saveClientInfo = (data) => {
    return httpClient.post(`/api/v1/info`, data);
}

const getClientInfo = (clientId) => {
    return httpClient.get(`/api/v1/info/${clientId}`);
}

const deleteClientInfo = (clientId) => {
    return httpClient.delete(`/api/v1/info/${clientId}`);
}

export default { saveClientInfo, getClientInfo, deleteClientInfo };