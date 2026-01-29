import API from "./axios";

// 🔐 Authentication APIs
export const loginUser = (data) => API.post("/auth/login", data);
export const logoutUser = () => API.post("/auth/logout");
export const refreshToken = () => API.post("/auth/refresh");
