import API from "./axios";

export const sendOTP = (email) =>
  API.post("/auth/forgot-password", { email });

export const verifyOTP = (data) =>
  API.post("/auth/verify-otp", data);

export const resetPassword = (data) =>
  API.post("/auth/reset-password", data);
