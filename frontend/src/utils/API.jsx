import axios from "axios";
import { toast } from "react-toastify";
// Create an Axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_BASEURL || "", // Replace with your API base URL
  timeout: 10000,
});
console.log("url", import.meta.env.VITE_BASEURL);

// Utility functions for token storage
const getAccessToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");
const saveAccessToken = (token) => localStorage.setItem("accessToken", token);
const saveRefreshToken = (token) => localStorage.setItem("refreshToken", token);
const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// Request interceptor to add the `accessToken` to the headers
API.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 and refresh tokens
API.interceptors.response.use(
  (response) => {
    // Save tokens on sign-in response
    if (
      response.config.url.includes("/api/public/auth/signin") &&
      response.data.data?.accessToken &&
      response.data.data?.refreshToken
    ) {
      toast.success("Sign-in successful!");
      saveAccessToken(response.data.data.accessToken);
      saveRefreshToken(response.data.data.refreshToken);
      window.location.href = response.data.data.redirectPath;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors and attempt to refresh the token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/api/public/auth/refreshtoken")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          clearTokens();
          window.location.href = "/"; // Redirect to login page
          return Promise.reject(error);
        }

        // Call the refresh endpoint
        const { data } = await API.post("/api/public/auth/refreshtoken", {
          refreshToken,
        });
        const newAccessToken = data.data.accessToken;
        const newRefreshToken = data.data.refreshToken;

        // Save new tokens
        saveAccessToken(newAccessToken);
        saveRefreshToken(newRefreshToken);

        // Retry the original request with the new access token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        clearTokens();
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }
    toast.error(error.response?.data?.message || "An error occurred.");
    return Promise.reject(error.response || error);
  }
);

export default API;
