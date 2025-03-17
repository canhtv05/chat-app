import httpRequest, { handlerRequest } from '~/util/httpRequest';

const getCurrentUser = async (token) => {
    const [error, result] = await handlerRequest(
        httpRequest.get('/users/my-info', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
    );
    return [error, result];
};

const searchUser = async (query) => {
    const [error, result] = await handlerRequest(
        httpRequest.get('/users/search', {
            params: {
                query,
            },
        }),
    );
    return [error, result];
};

const updateUser = async (token, data) => {
    const [error, result] = await handlerRequest(
        httpRequest.post('/users/update', data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
    );
    return [error, result];
};

export { getCurrentUser, searchUser, updateUser };
