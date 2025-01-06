import httpClient from "../http-common";

const getTracking = (creditid) => {
    return httpClient.get(`/api/v1/tracking/${creditid}`);
;}

const cancelCredit  = (id) => {
    return httpClient.get(`/api/v1/tracking/cancel/${id}`);
};

const updateTracking = (id, state) => {
    return httpClient.put(`/api/v1/tracking/update/${id}?state=${state}`);
};

const updateComments = (creditId, comments, state) => {
    return httpClient.post(`/api/v1/tracking/updateComments/${creditId}`, null, {
      params: {
        comments,
        state,
      },
    });
  };

export default { getTracking , cancelCredit , updateTracking , updateComments };