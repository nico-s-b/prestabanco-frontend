import httpClient from "../http-common";

const simulate = (creditType, loanPeriod, creditMount, propertyValue, annualRate) => {
    return httpClient.post(`/api/v1/calculations/simulate`, {
        creditType,
        loanPeriod,
        creditMount,
        propertyValue,
        annualRate
    });
};

const restrictions = (data) => {
    return httpClient.post('/api/v1/calculations/restrictions', data);
  };

  export default { simulate, restrictions};