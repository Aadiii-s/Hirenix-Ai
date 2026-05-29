import api from "./axios";

export const getReadinessScoreApi = async () => {
  const response = await api.get("/readiness/score");
  return response.data;
};