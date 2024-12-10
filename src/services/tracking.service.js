import httpClient from "../http-common";

const getTracking = (creditid) => {
    return httpClient.get(`/api/v1/tracking/${creditid}`);
;}

export default { getTracking };