import httpClient from "../http-common";

const getAllExecutives = () => {
  return httpClient.get('/api/v1/executives/');
};

const getExecutiveById = (id) => {
  return httpClient.get(`/api/v1/executives/${id}`);
};

const updateExecutive = (id, data) => {
    return httpClient.put(`/api/v1/executives/${id}`, data);
};

const registerExecutive = (data) => {
    return httpClient.post('/api/v1/executives/', data);
}

export default { getAllExecutives,  getExecutiveById , updateExecutive ,registerExecutive};