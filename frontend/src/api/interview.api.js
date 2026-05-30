import api from "./axios";

export const startMockInterviewApi = async (payload) => {
  const response = await api.post("/interviews/start", payload);
  return response.data;
};

export const submitInterviewAnswerApi = async (interviewId, payload) => {
  const response = await api.post(`/interviews/${interviewId}/answer`, payload);
  return response.data;
};

export const completeMockInterviewApi = async (interviewId) => {
  const response = await api.post(`/interviews/${interviewId}/complete`);
  return response.data;
};

export const getMyMockInterviewsApi = async () => {
  const response = await api.get("/interviews/my-interviews");
  return response.data;
};

export const getMockInterviewByIdApi = async (interviewId) => {
  const response = await api.get(`/interviews/${interviewId}`);
  return response.data;
};

export const deleteMockInterviewApi = async (interviewId) => {
  const response = await api.delete(`/interviews/${interviewId}`);
  return response.data;
};

export const getMockInterviewStatsApi = async () => {
  const response = await api.get("/interviews/stats/summary");
  return response.data;
};