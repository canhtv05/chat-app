import httpRequest, { handlerRequest } from '~/utils/httpRequest';

export const getAllMessagesFromChat = async (chatId) => {
    const [error, result] = await handlerRequest(httpRequest.get(`/messages/chats/${chatId}`));
    return [error, result];
};

export const sendMessage = async (request) => {
    // request = {chatId, content}
    const [error, result] = await handlerRequest(httpRequest.post('/messages/send', request));
    return [error, result];
};
