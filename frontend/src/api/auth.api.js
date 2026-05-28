import api from "./axios";

export const registerUserApi = async(userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
};

export const loginUserApi = async(Credentials) =>{
    const response = await api.post("/auth/login", Credentials);
    return response.data;
};

export const logoutUserApi = async () =>{
    const response = await api.post("auth/logout");
    return response.data;
};

export const getCurrentUserApi = async () =>{
    const response = await api.get("auth/me");
    return response.data;
};

export const updateUserProfileApi = async (profileData) => {
    const response = await api.put("/auth/profile", profileData);
    return response.data;

}