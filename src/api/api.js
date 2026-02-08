import axios from "axios";
import { showLoader, hideLoader } from "../utils/loaderService";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API = axios.create({ 
  baseURL: `${baseURL}/api`,
  timeout: 60000, // 60 seconds timeout to accommodate PDF generation
});

// Track active requests to hide loader only when all are done
let activeRequests = 0;

const handleRequestStart = (config) => {
  if (config.showLoader !== false) {
    activeRequests++;
    showLoader(config.loaderMessage || "Processing...");
  }
  return config;
};

const handleRequestStop = () => {
  activeRequests--;
  if (activeRequests <= 0) {
    activeRequests = 0;
    hideLoader();
  }
};

// Basic Retry logic for network errors or 5xx
API.interceptors.response.use(
  (response) => {
    handleRequestStop();
    return response;
  },
  async (error) => {
    handleRequestStop();
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
  handleRequestStart(req);
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
