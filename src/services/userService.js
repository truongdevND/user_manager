import { postRequest, getRequest, deleteRequest, putRequest } from "./Axios";

export const getUserListPagination = async (params) => {
  try {
    const response = await getRequest("/user/pagnition", params);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch user list with pagination");
  }
};


export const getUserById = async (userId) => {
  try {
    const response = await getRequest(`/user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch user by ID");
  }
};

export const getMyInfo = async () => {
  try {
    const response = await getRequest("/user/myInfo");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch my info");
  }
};

export const createUser = async (userData) => {
  try {
    const response = await postRequest("/user/create", userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create user");
  }
};
export const updateUser = async (userId, userData) => {
  try {
    const response = await putRequest(`/user/update/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update user");
  }
};

export const updatePassword = async (userId, passwordData) => {
  try {
    const response = await putRequest(`/user/update-pass/${userId}`, passwordData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update password");
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await deleteRequest(`/user/delete/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete user");
  }
};

export const activateUser = async (activationData) => {
  try {
    const response = await getRequest("/user/active", activationData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to activate user");
  }
};