import axios from 'axios';

// Create a shared Axios instance configured for the backend
const api = axios.create({
    baseURL: 'http://localhost:8080', // Spring Boot default port
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
