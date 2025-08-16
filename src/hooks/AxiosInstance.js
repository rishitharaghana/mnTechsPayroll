import axios from 'axios';


const ngrokAxiosInstance = axios.create({

     baseURL: 'https://fe2663e99cb4.ngrok-free.app',

  headers: {
    'Content-Type': 'application/json',
  },  
});


export default ngrokAxiosInstance;