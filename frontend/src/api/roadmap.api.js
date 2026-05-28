import api from "./axios";

export const generateRoadmapApi = async (roadmapData) => {
  const response = await api.post("/roadmaps/generate", roadmapData);
  return response.data;
};

export const getMyRoadmapsApi = async () => {
  const response = await api.get("/roadmaps/my-roadmaps");
  return response.data;
};

export const getRoadmapByIdApi = async (roadmapId) => {
  const response = await api.get(`/roadmaps/${roadmapId}`);
  return response.data;
};

export const deleteRoadmapApi = async (roadmapId) => {
  const response = await api.delete(`/roadmaps/${roadmapId}`);
  return response.data;
};