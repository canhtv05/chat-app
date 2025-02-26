package com.canhtv05.chatapp.service;

import com.canhtv05.chatapp.dto.response.MessageResponse;
import com.canhtv05.chatapp.dto.resquest.SendMessageRequest;
import com.canhtv05.chatapp.entity.User;

import java.util.List;

public interface MessageService {

    MessageResponse sendMessage(SendMessageRequest request);

    List<MessageResponse> getChatsMessages(String chatId, User userRequest);

    MessageResponse findMessageById(String messageId, User userRequest);

    void deleteMessage(String messageId, User userRequest);
}
