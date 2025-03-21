import httpRequest, { handlerRequest } from '~/util/httpRequest';

export const signup = async (data) => {
    const [error, result] = await handlerRequest(httpRequest.post('/auth/register', data));
    return [error, result];
};

export const signin = async (data) => {
    const [error, result] = await handlerRequest(httpRequest.post('/auth/login', data));
    return [error, result];
};

export const getCurrentUser = async (token) => {
    const [error, result] = await handlerRequest(
        httpRequest.get('/auth/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
    );
    return [error, result];
};

export const updateCurrentUser = async (token, data) => {
    const [error, result] = await handlerRequest(
        httpRequest.patch('/auth/me/update', data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
    );
    return [error, result];
};
