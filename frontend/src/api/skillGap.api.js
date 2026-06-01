import api from "./axios";

export const generateSkillGapAnalysisApi = async (payload = {}) => {
  const response = await api.post("/skill-gap/generate", payload);
  return response.data;
};

export const getLatestSkillGapAnalysisApi = async () => {
  const response = await api.get("/skill-gap/analyze");
  return response.data;
};

export const getMySkillGapAnalysesApi = async () => {
  const response = await api.get("/skill-gap/my-analyses");
  return response.data;
};

export const getSkillGapAnalysisByIdApi = async (analysisId) => {
  const response = await api.get(`/skill-gap/${analysisId}`);
  return response.data;
};

export const deleteSkillGapAnalysisApi = async (analysisId) => {
  const response = await api.delete(`/skill-gap/${analysisId}`);
  return response.data;
};