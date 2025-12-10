import axios from "axios";

const api = axios.create({
  baseURL: "https://pj-backend-bs1t.onrender.com",
  withCredentials: true, // para enviar cookies JWT automáticamente
});

export default api;
