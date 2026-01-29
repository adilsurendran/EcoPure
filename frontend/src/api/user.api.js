import API from "./axios";

export const registerUser = (data) =>
  API.post("/register/user", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  export const getUserProfile = () =>
  API.get("/user/profile");

export const updateUserProfile = (data) =>
  API.put("/user/profile", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  export const sendUserFeedback = (data) =>
  API.post("/feedback", data);