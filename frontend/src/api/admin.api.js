import API from "./axios";

export const fetchUsers = () => API.get("/admin/users");
export const toggleUserStatus = (authId) => API.patch(`/admin/users/${authId}/toggle`);
export const fetchWorkers = () => API.get("/admin/workers");
export const toggleWorkerStatus = (authId) => {
  API.patch(`/admin/workers/toggle/${authId}`);
};
export const addWorker = (data) =>
  API.post("/admin/workers/add", data);

export const fetchDealers = () =>
  API.get("/admin/dealers");
export const toggleDealerStatus = (authId) =>
  API.patch(`/admin/dealers/toggle/${authId}`);

// waste post
export const getAdminWastePosts = () =>
  API.get("/admin/waste");
export const createWastePost = (data) =>
  API.post("/admin/waste", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateWastePost = (id, data) =>
  API.put(`/admin/waste/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteWastePost = (id) =>
  API.delete(`/admin/waste/${id}`);

export const getAllWasteRequests = () =>
  API.get("/admin/waste-requests");

export const approveWasteRequest = (id) =>
  API.put(`/admin/waste-requests/${id}/approve`);

export const rejectWasteRequest = (id) =>
  API.put(`/admin/waste-requests/${id}/reject`);

export const getAllDirectRequests = () =>
  API.get("/admin/direct-requests");

export const acceptDirectRequest = (id) =>
  API.put(`/admin/direct-requests/${id}/accept`);

export const rejectDirectRequest = (id) =>
  API.put(`/admin/direct-requests/${id}/reject`);

export const getAllUserFeedbacks = () =>
  API.get("/admin/feedback");