import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API = axios.create({ 
  baseURL: `${baseURL}/api`,
  timeout: 60000, // Increased to 60 seconds for document generation
});

// Basic Retry logic for network errors or 5xx
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    if (!config || !config.retry) config.retry = 0;
    
    // Retry up to 2 times for 5xx errors or network errors
    if (config.retry < 2 && (!response || response.status >= 500)) {
      config.retry += 1;
      const delay = config.retry * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      return API(config);
    }
    return Promise.reject(error);
  }
);

export { baseURL };

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
