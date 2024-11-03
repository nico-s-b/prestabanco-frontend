import httpClient from "../http-common";

const getAllCredits = () => {
  return httpClient.get('/api/v1/credits/');
};

const getCreditById = (id) => {
  return httpClient.get(`/api/v1/credits/${id}`);
};

const getCreditsByClient = (id) => {
    return httpClient.get(`/api/v1/credits/${id}/credits`);
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

const request = (creditType, loanPeriod, creditMount, propertyValue, userId) => {
    return httpClient.post('/api/v1/credits/request', {
        creditType,
        loanPeriod,
        creditMount,
        propertyValue
    }, {
        params: { clientId: userId }
      });
};

const restrictions = (data) => {
    return httpClient.get('/api/v1/credits/restrictions', {
        params: data
      });
};

export default { getAllCredits,  getCreditById , getCreditsByClient, updateCredit , 
    deleteCredit, simulate, restrictions, request};