import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Accept': 'application/json',
    }
});

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
        config.headers.Authorization = `${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default apiClient;
