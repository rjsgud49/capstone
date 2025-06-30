import axios from 'axios';

const gcpAPI = axios.create({
    baseURL: import.meta.env.VITE_API_ALT_BASE_URL, // '/api'
  headers: {
    'Content-Type': 'application/json',
  }
});

export default gcpAPI;
