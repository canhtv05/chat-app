import httpRequest, { handlerRequest } from '~/util/httpRequest';

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

export { searchUser };
