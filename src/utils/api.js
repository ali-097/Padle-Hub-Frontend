import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const getUserFromToken = (token) => {
  const decoded = decodeToken(token);
  if (decoded) {
    return {
      id: decoded.id,
      role: decoded.role,
    };
  }
  return null;
};

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
  getCourtById: (id) => api.get(`/courts/${id}`),
  createCourt: (courtData) => api.post("/courts", courtData),
  updateCourt: (id, courtData) => api.put(`/courts/${id}`, courtData),
  deleteCourt: (id) => api.delete(`/courts/${id}`),
  addClosedDate: (id, closedDateData) =>
    api.post(`/courts/${id}/closed-date`, closedDateData),
};

export default api;
