import httpClient from "../http-common";

const getAllCredits = () => {
  return httpClient.get('/api/v1/credits/');
};

const getCreditById = (id) => {
  return httpClient.get(`/api/v1/credits/${id}`);
};

const updateCredit = (id, data) => {
    return httpClient.put(`/api/v1/credits/${id}`, data);
};

const deleteCredit = (id) => {
    return httpClient.delete(`/api/v1/credits/${id}`, data);
};

const simulate = (creditType, loanPeriod, creditMount, propertyValue) => {
    return httpClient.post(`/api/v1/credits/simulate`, {
        creditType,
        loanPeriod,
        creditMount,
        propertyValue
    });
};

const request = (data) => {
    return httpClient.put('/api/v1/credits/request', data);
};

const restrictions = (data) => {
    return httpClient.get('/api/v1/credits/restrictions')
};

export default { getAllCredits,  getCreditById , updateCredit , 
    deleteCredit, simulate, restrictions, request};