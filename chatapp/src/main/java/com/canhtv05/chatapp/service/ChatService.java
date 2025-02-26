package com.canhtv05.chatapp.service;

import com.canhtv05.chatapp.dto.response.ChatResponse;
import com.canhtv05.chatapp.dto.resquest.GroupChatCreationRequest;
import com.canhtv05.chatapp.entity.Chat;
import com.canhtv05.chatapp.entity.User;

import java.util.List;

public interface ChatService {

    ChatResponse createChat(User userRequest, String userId);

    Chat findChatById(String chatId);

    List<ChatResponse> findAllChatByUserId(String userId);

    ChatResponse createGroup(User userRequest, GroupChatCreationRequest request);

    ChatResponse addUserToGroup(String chatId, String userId, User userRequest);

    ChatResponse renameGroup(String chatId, String groupName, User userRequest);

    ChatResponse removeUserFromGroup(String chatId, String userId, User userRequest);

    void deleteChat(String chatId, String userId);
}
