import axios from 'axios';

export const axiosInstance = axios.create({
    headers: {
        'Content-type': "application/json"
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers['x-access-token'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);