import httpClient from "../http-common";

const getAllUsers = () => {
  return httpClient.get("/api/v1/users/");
};

const getUserById = (id) => {
  return httpClient.get(`/api/v1/users/${id}`);
};

const deleteUser = (id) => {
  return httpClient.delete(`/api/v1/users/${id}`);
};

export default { getAllUsers,  getUserById,  deleteUser };