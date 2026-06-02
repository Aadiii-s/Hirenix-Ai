import api  from "./axios";

export const getAnalyticsOverviewApi = async () => {
    const response = await api.get("/analytics/overview");
    return response.data;
};