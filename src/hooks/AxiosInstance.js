import axios from "axios";

const ngrokAxiosInstance = axios.create({
  headers: { "Content-Type": "application/json" },
});

export default ngrokAxiosInstance;