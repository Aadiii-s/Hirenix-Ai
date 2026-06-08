import api from "./axios";

export const getAiRequestLogsApi = async (params = {}) => {
  const response = await api.get("/ai-logs", { params });
  return response.data;
};

export const getAiRequestStatsApi = async () => {
  const response = await api.get("/ai-logs/stats");
  return response.data;
};