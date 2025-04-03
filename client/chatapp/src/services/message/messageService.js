import httpRequest, { handlerRequest } from '~/utils/httpRequest';

export const getAllMessagesFromChat = async (chatId, page) => {
    const [error, result] = await handlerRequest(
        httpRequest.get(`/messages/chats/${chatId}`, {
            params: {
                page,
            },
        }),
    );
    return [error, result];
};

export const sendMessage = async (request) => {
    // request = {chatId, content}
    console.log(request);
    const [error, result] = await handlerRequest(httpRequest.post('/messages/send', request));
    return [error, result];
};
