import httpRequest, { handlerRequest } from '~/utils/httpRequest';

export const getAllMyChats = async () => {
    const [error, result] = await handlerRequest(httpRequest.get('/chats/users'));
    return [error, result];
};

export const createSingleChat = async (userId) => {
    const [error, result] = await handlerRequest(httpRequest.post('/chats/single', { userId }));
    return [error, result];
};
