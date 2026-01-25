import axios from "axios";

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api" });

API.interceptors.request.use((req) => {
  try {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      req.headers.Authorization = `Bearer ${JSON.parse(userInfo).token}`;
    }
  } catch (error) {
    console.error("Error parsing userInfo from localStorage", error);
  }
  return req;
});

export default API;
