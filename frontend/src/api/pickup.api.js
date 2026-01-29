import API from "./axios";

export const createPickupRequest = (data) =>
  API.post("/pickups", data);

export const fetchMyPickupRequests = () =>
  API.get("/pickups/my");

export const cancelPickupRequest = (id) =>
  API.patch(`/pickups/${id}/cancel`);

export const collectPickupRequest = (id) =>
  API.put(`/pickups/${id}/collect`);

export const fetchPickups = (status) =>
  API.get(`/pickups/admin/pickups?status=${status}`);

export const fetchAvailableWorkers = () =>
  API.get("/pickups/admin/pickups/workers");

export const assignWorker = (data) =>
  API.post("/pickups/admin/pickups/assign", data);

export const completePickup = (id) =>
  API.patch(`/pickups/admin/pickups/${id}/complete`);

export const fetchAssignedPickups = () =>
  API.get("/pickups/worker/pickups/assigned");

export const fetchPickupHistory = () =>
  API.get("/pickups/worker/pickups/history");