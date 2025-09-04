import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
};

export const courtAPI = {
  getAllCourts: () => api.get("/courts"),
  createCourt: (courtData) => api.post("/courts", courtData),
  updateCourt: (id, courtData) => api.put(`/courts/${id}`, courtData),
  deleteCourt: (id) => api.delete(`/courts/${id}`),
};

export default api;
