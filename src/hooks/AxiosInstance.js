import axios from "axios";

const ngrokAxiosInstance = axios.create({
  baseURL: "https://4aa8e0f5e376.ngrok-free.app", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default ngrokAxiosInstance;
