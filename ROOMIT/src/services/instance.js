// 📁 api/instance.js
import axios from 'axios';

const api = axios.create({
        // baseURL: "http://34.64.91.165:8082/api",
        baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // withCredentials: true,
});

export default api;
``