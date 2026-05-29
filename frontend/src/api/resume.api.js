import api from "./axios";

export const analyzeResumeApi = async (formData) => {
  const response = await api.post("/resumes/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getMyResumeAnalysesApi = async () => {
  const response = await api.get("/resumes/my-analyses");
  return response.data;
};

export const getLatestResumeAnalysisApi = async () => {
  const response = await api.get("/resumes/latest");
  return response.data;
};

export const getResumeAnalysisByIdApi = async (analysisId) => {
  const response = await api.get(`/resumes/${analysisId}`);
  return response.data;
};

export const deleteResumeAnalysisApi = async (analysisId) => {
  const response = await api.delete(`/resumes/${analysisId}`);
  return response.data;
};