import { postRequest, getRequest } from './Axios';

export const login = async (credentials) => {
  try {
    const response = await postRequest('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const register = async (userData) => {
  try {
    const response = await postRequest('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const logout = async () => {
  try {
    const response = await postRequest('/auth/logout');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Logout failed');
  }
};

export const refreshToken = async () => {
  try {
    const response = await postRequest('/auth/refresh-token');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Token refresh failed');
  }
};

export const sendEmail = async (email) => {
  try {
    const response = await getRequest(`/send-email?email=${email}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gửi email thất bại');
  }
};

export const activeUser = async (token) => {
  try {
    const response = await getRequest(`/user/active?token=${token}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gửi token không hợp lệ');
  }
};