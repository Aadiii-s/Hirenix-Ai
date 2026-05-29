import api from "./axios";

export const createDsaQuestionApi = async (questionData) => {
  const response = await api.post("/dsa/questions", questionData);
  return response.data;
};

export const getDsaQuestionsApi = async (filters = {}) => {
  const response = await api.get("/dsa/questions", {
    params: filters,
  });

  return response.data;
};

export const getDsaQuestionByIdApi = async (questionId) => {
  const response = await api.get(`/dsa/questions/${questionId}`);
  return response.data;
};

export const updateDsaQuestionApi = async (questionId, questionData) => {
  const response = await api.patch(`/dsa/questions/${questionId}`, questionData);
  return response.data;
};

export const updateDsaQuestionStatusApi = async (questionId, status) => {
  const response = await api.patch(`/dsa/questions/${questionId}/status`, {
    status,
  });

  return response.data;
};

export const deleteDsaQuestionApi = async (questionId) => {
  const response = await api.delete(`/dsa/questions/${questionId}`);
  return response.data;
};

export const getDsaStatsApi = async () => {
  const response = await api.get("/dsa/stats");
  return response.data;
};