package com.canhtv05.chatapp.service;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import com.canhtv05.chatapp.dto.response.MessageResponse;
import com.canhtv05.chatapp.dto.resquest.SendMessageRequest;
import com.canhtv05.chatapp.entity.Message;
import com.canhtv05.chatapp.entity.User;

public interface MessageService {

    MessageResponse sendMessage(SendMessageRequest request);

    Page<MessageResponse> getChatsMessages(String chatId, User userRequest, Integer page, Integer size);

    Message findMessageById(String messageId, User userRequest);

    void deleteMessage(String messageId, User userRequest);

    MessageResponse getLastMessageByChatId(String chatId);

    String uploadImage(MultipartFile file);
}
