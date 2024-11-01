import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get('api/v1/accounts/');
}

const createOrUpdate = (clientId, data) => {
    return httpClient.post(`api/v1/accounts/${clientId}/account`, data);
}

const get = (clientId) => {
    return httpClient.get(`api/v1/accounts/${clientId}}`);
}

const remove = id => {
    return httpClient.delete(`api/v1/accounts/${id}`);
}

export default { getAll, createOrUpdate, get, remove };