import axios from "axios";

const api = axios.create({
  baseURL: "https://fundvision-teste-mudancas.up.railway.app/api/",
  // baseURL: "http://localhost:8080/api/",
  // Remember the /api/
});

export default api;
