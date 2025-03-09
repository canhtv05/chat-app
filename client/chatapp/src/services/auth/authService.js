import httpRequest, { handlerRequest } from '~/util/httpRequest';

export const signup = async (data) => {
    const [error, result] = await handlerRequest(httpRequest.post('/auth/sign-up', data));
    return [error, result];
};

export const signin = async (data) => {
    const [error, result] = await handlerRequest(httpRequest.post('/auth/sign-in', data));
    return [error, result];
};
