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

const setTotalCosts = (id, creditType, loanPeriod, creditMount, propertyValue, annualRate) => {
    return httpClient.post(`/api/v1/calculations/total`, {
        id,
        creditType,
        loanPeriod,
        creditMount,
        propertyValue,
        annualRate
    });
};

const getTotalCostsByCreditId = (id) => {
    return httpClient.get(`/api/v1/calculations/${id}`);
}

const getInstallment = (data) => {
    return httpClient.post(`/api/v1/calculations/installment`, data);
}

const getMaxFinancing = (data) => {
    return httpClient.post(`/api/v1/calculations/maxFinancing`, data);
}

export default {
    simulate,
    restrictions,
    setTotalCosts,
    getTotalCostsByCreditId,
    getInstallment,
    getMaxFinancing
};
