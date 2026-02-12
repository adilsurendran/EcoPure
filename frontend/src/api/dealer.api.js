import API from "./axios";

export const registerDealer = (data) =>
  API.post("/register/dealer", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getDealerProfile = () =>
  API.get("/dealer/profile");

export const updateDealerProfile = (data) =>
  API.put("/dealer/profile", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getDealerStats = () =>
  API.get("/dealer/stats");

// waste post
export const getAllWastePosts = () =>
  API.get("/dealer/waste-posts");

export const createWasteRequest = (data) =>
  API.post("/dealer/waste-request", data);

export const getDealerRequests = () =>
  API.get("/dealer/requests");

export const cancelDealerRequest = (id) =>
  API.put(`/dealer/requests/${id}/cancel`);

export const markDelivered = (id) =>
  API.put(`/dealer/requests/${id}/delivered`);

export const createDirectRequest = (data) =>
  API.post("/dealer/direct-request", data);

export const getDealerDirectRequests = () =>
  API.get("/dealer/direct-requests");

export const cancelDirectRequest = (id) =>
  API.put(`/dealer/direct-requests/${id}/cancel`);

export const markDirectRequestDelivered = (id) =>
  API.put(`/dealer/direct-requests/${id}/delivered`);