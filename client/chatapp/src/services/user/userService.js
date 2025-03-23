import httpRequest, { handlerRequest } from '~/utils/httpRequest';

const searchUser = async (query, page) => {
    const [error, result] = await handlerRequest(
        httpRequest.get('/users/search', {
            params: {
                q: query,
                page,
                size: 10,
            },
        }),
    );
    return [error, result];
};

export { searchUser };
