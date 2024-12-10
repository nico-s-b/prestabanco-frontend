import httpClient from "../http-common";

const createOrUpdateAccount = (clientId, data) => {
    return httpClient.put(`api/v1/accounts/${clientId}`, data);
}

const getAccount = (clientId) => {
    return httpClient.get(`api/v1/accounts/${clientId}`);
}

const removeAccount = id => {
    return httpClient.delete(`api/v1/accounts/${id}`);
}

const createOrUpdateRecord = (clientId, data) => {
    return httpClient.put(`api/v1/creditrecords/${clientId}`, data);
}

const getRecord = (clientId) => {
    return httpClient.get(`api/v1/creditrecords/${clientId}`);
}

const removeRecord = id => {
    return httpClient.delete(`api/v1/creditrecords/${id}`);
}

const createOrUpdateEmployment = (clientId, data) => {
    return httpClient.put(`api/v1/employmentrecords/${clientId}`, data);
}

const getEmployment = (clientId) => {
    return httpClient.get(`api/v1/employmentrecords/${clientId}`);
}

const removeEmployment = id => {
    return httpClient.delete(`api/v1/employmentrecords/${id}`);
}


export default { createOrUpdateAccount, getAccount, removeAccount ,
    createOrUpdateRecord, getRecord, removeRecord,
    createOrUpdateEmployment, getEmployment, removeEmployment
};