import axios from "axios";

const API = axios.create({
<<<<<<< HEAD
  baseURL: process.env.REACT_APP_API_URL,
});

// ✅ Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
=======
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
>>>>>>> 6d415fa189de2238d0f34353b829be4aeec909b6
});

export default API;