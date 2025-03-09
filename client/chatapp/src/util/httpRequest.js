import axios from 'axios';

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

export const put = async (path, data, options = {}) => {
    const res = await httpRequest.put(path, data, options);
    return res.data;
};

export const del = async (path, options = {}) => {
    const res = await httpRequest.delete(path, options);
    return res.data;
};

export default httpRequest;
