import axios from 'axios';
import { refreshTokenRequest } from '~/services/auth/authService';
import cookieUtil from './cookieUtils';

const httpRequest = axios.create({
    baseURL: 'http://localhost:1710/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export const handlerRequest = (promise) => {
    return promise.then((data) => [undefined, data.data]).catch((err) => [err, undefined]);
};

export const get = async (path, options = {}) => {
    const res = await httpRequest.get(path, options);
    return res.data;
};

export const post = async (path, data, options = {}) => {
    const res = await httpRequest.post(path, data, options);
    return res.data;
};

export const patch = async (path, data, options = {}) => {
    const res = await httpRequest.patch(path, data, options);
    return res.data;
};

export const put = async (path, data, options = {}) => {
    const res = await httpRequest.put(path, data, options);
    return res.data;
};

export const del = async (path, options = {}) => {
    const res = await httpRequest.delete(path, options);
    return res.data;
};

// all req has header
httpRequest.interceptors.request.use(
    (config) => {
        const accessToken = cookieUtil.getStorage()?.accessToken;
        const publicRoutes = ['/auth/login', '/auth/register', '/auth/refresh-token'];
        if (accessToken && !publicRoutes.some((route) => config.url.includes(route))) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

httpRequest.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        const getRefreshToken = cookieUtil.getStorage()?.refreshToken;

        console.log(cookieUtil.getStorage());

        if (error.response?.data?.code === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                if (!getRefreshToken) {
                    throw new Error('No refresh token available');
                }

                const [refreshError, refreshData] = await refreshTokenRequest();

                if (refreshError) {
                    cookieUtil.deleteStorage();
                    return Promise.reject(refreshError);
                }

                const { accessToken, refreshToken } = refreshData.data;
                const dataStorage = {
                    accessToken,
                    refreshToken,
                };
                cookieUtil.setStorage(dataStorage);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return httpRequest(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export default httpRequest;
