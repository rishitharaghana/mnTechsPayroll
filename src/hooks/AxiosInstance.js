import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "https://payrollapi.mntechs.com/",
  //    baseURL: 'http://localhost:3007/',

  headers: {
    "Content-Type": "application/json",
  },
});

export default AxiosInstance;
