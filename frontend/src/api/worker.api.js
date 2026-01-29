import API from "./axios";

export const registerWorker = (data) =>
  API.post("/register/worker", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
