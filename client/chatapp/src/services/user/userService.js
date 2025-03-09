import httpRequest, { handlerRequest } from '~/util/httpRequest';

export const getCurrentUser = async (token) => {
    const [error, result] = await handlerRequest(
        httpRequest.get('/users/my-info', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
    );
    return [error, result];
};

export const searchUser = async (query) => {
    const [error, result] = await handlerRequest(
        httpRequest.get('/users/search', {
            params: {
                query,
            },
        }),
    );
    return [error, result];
};

export const updateUser = async (token, data) => {
    const [error, result] = await handlerRequest(
        httpRequest.post('/users/update', data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
    );
    return [error, result];
};
