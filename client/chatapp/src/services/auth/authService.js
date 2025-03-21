import httpRequest, { handlerRequest } from '~/utils/httpRequest';

export const signup = async (data) => {
    const [error, result] = await handlerRequest(httpRequest.post('/auth/register', data));
    return [error, result];
};

export const signin = async (data) => {
    const [error, result] = await handlerRequest(httpRequest.post('/auth/login', data));
    return [error, result];
};

export const getCurrentUser = async () => {
    const [error, result] = await handlerRequest(httpRequest.get('/auth/me'));
    return [error, result];
};

export const updateCurrentUser = async (data) => {
    const [error, result] = await handlerRequest(httpRequest.patch('/auth/me/update', data));
    return [error, result];
};

export const refreshTokenRequest = async (refreshToken) => {
    const [error, result] = await handlerRequest(httpRequest.post('/auth/refresh-token', { refreshToken }));
    return [error, result];
};
