import axios from 'axios';

const gcpAPI = axios.create({
    // baseURL: "http://34.122.44.97:8888/api", // '/api'
    baseURL: import.meta.env.VITE_API_ALT_BASE_URL, // '/api'
  headers: {
    'Content-Type': 'application/json',
  }
});

export default gcpAPI;
