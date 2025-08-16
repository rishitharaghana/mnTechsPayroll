import axios from "axios";

const ngrokAxiosInstance = axios.create({
  baseURL: "https://1b454e4b9947.ngrok-free.app", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default ngrokAxiosInstance;
