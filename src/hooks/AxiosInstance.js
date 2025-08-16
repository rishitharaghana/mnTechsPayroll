import axios from "axios";

const ngrokAxiosInstance = axios.create({
  baseURL: "https://bb36dae575f7.ngrok-free.app", 
  headers: {
    "Content-Type": "application/json",
  },

});
ngrokAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Axios error:", error.message);
    return Promise.reject(error);
  }
);

export default ngrokAxiosInstance;

