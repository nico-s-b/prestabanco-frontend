import httpClient from "../http-common";

const getAllCredits = () => {
  return httpClient.get('/api/v1/credits/');
};

const getCreditById = (id) => {
  return httpClient.get(`/api/v1/credits/${id}`);
};

const getCreditsByClient = (id) => {
  return httpClient.get(`/api/v1/credits/${id}/credits`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

const createCredit = (data) => {
  return httpClient.post(`/api/v1/credits/`, data);
};

const updateCredit = (id, data) => {
    return httpClient.put(`/api/v1/credits/${id}`, data);
};

const cancelCredit  = (id) => {
    return httpClient.get(`/api/v1/credits/cancel${id}`);
};

const simulate = (creditType, loanPeriod, creditMount, propertyValue, annualRate) => {
    return httpClient.post(`/api/v1/credits/simulate`, {
        creditType,
        loanPeriod,
        creditMount,
        propertyValue,
        annualRate
    });
};

const request = (creditType, loanPeriod, creditMount, propertyValue, annualRate, userId) => {
    return httpClient.post('/api/v1/credits/request', {
        creditType,
        loanPeriod,
        creditMount,
        propertyValue,
        annualRate
    }, {
        params: { clientId: userId }
      });
};

const restrictions = (data) => {
  return httpClient.post('/api/v1/credits/restrictions', data);
};

const validateDocs = (id) => {
  return httpClient.get(`/api/v1/credits/docvalid?id=${id}`);
};

export default { getAllCredits,  getCreditById , getCreditsByClient, updateCredit , 
  createCredit , simulate, restrictions, request, validateDocs , cancelCredit };