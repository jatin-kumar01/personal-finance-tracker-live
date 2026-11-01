import axiosInstance from './axiosInstance';

export const getOverallSummary = () =>
    axiosInstance.get('/dashboard/summary');

export const getMonthlySummary = (year, month) =>
    axiosInstance.get('/dashboard/monthly-summary', { params: { year, month } });

export const getCategorySummary = (type) =>
    axiosInstance.get('/dashboard/category-summary', { params: type ? { type } : {} });