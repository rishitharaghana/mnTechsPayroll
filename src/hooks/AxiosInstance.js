import axios from "axios";

const ngrokAxiosInstance = axios.create({
  baseURL: "https://3beff8cdc739.ngrok-free.app",
  headers: {
    "Content-Type": "application/json",
  },
});

export default ngrokAxiosInstance;