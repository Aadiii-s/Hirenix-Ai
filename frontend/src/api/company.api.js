import api from "./axios";

export const createCompanyPrepApi = async (companyData) => {
  const response = await api.post("/companies", companyData);
  return response.data;
};

export const getMyCompanyPrepsApi = async (filters = {}) => {
  const response = await api.get("/companies", {
    params: filters,
  });

  return response.data;
};

export const getCompanyPrepByIdApi = async (companyId) => {
  const response = await api.get(`/companies/${companyId}`);
  return response.data;
};

export const updateCompanyPrepApi = async (companyId, companyData) => {
  const response = await api.patch(`/companies/${companyId}`, companyData);
  return response.data;
};

export const toggleCompanyTaskApi = async (companyId, taskId) => {
  const response = await api.patch(`/companies/${companyId}/task`, {
    taskId,
  });

  return response.data;
};

export const deleteCompanyPrepApi = async (companyId) => {
  const response = await api.delete(`/companies/${companyId}`);
  return response.data;
};

export const getCompanyPrepStatsApi = async () => {
  const response = await api.get("/companies/stats/summary");
  return response.data;
};