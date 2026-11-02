import axiosInstance from './axiosInstance';

export const createTransaction = (data) =>
  axiosInstance.post('/transactions', data);

export const getTransactions = (params = {}) =>
  axiosInstance.get('/transactions', { params });

export const getTransactionById = (id) =>
  axiosInstance.get(`/transactions/${id}`);

export const updateTransaction = (id, data) =>
  axiosInstance.put(`/transactions/${id}`, data);

export const deleteTransaction = (id) =>
  axiosInstance.delete(`/transactions/${id}`);
