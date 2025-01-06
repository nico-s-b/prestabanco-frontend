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

const updateClientInfo = (data) => {
    return httpClient.post(`/api/v1/info/save`, data);
}

const getEvaluationByCreditId = (creditId) => {
    return httpClient.get(`/api/v1/evals/${creditId}`);
}

const updateEvaluation = (creditId, data) => {
    return httpClient.put(`/api/v1/evals/${creditId}`, data);
};

const getClientMonthlyIncome = (clientId) => {
    return httpClient.get(`/api/v1/evals/income/${clientId}`);
}

const getClientAge = (clientInfo, creditInfo) => {
    return httpClient.post(`/api/v1/evals/age`, {
        client: clientInfo,
        credit: creditInfo
    });
};


export default { saveClientInfo, getClientInfo, deleteClientInfo , getEvaluationByCreditId , updateEvaluation, 
    updateClientInfo , getClientMonthlyIncome, getClientAge };