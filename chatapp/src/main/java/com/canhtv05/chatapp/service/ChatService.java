package com.canhtv05.chatapp.service;

import com.canhtv05.chatapp.dto.response.ChatResponse;
import com.canhtv05.chatapp.dto.resquest.GroupChatCreationRequest;
import com.canhtv05.chatapp.dto.resquest.UserChatRequest;

import java.util.List;

public interface ChatService {

    ChatResponse createChat(UserChatRequest request, String userId2);

    ChatResponse findChatById(String chatId);

    List<ChatResponse> findAllChatByUserId(String userId);

    ChatResponse createGroup(GroupChatCreationRequest request, UserChatRequest userRequest);

    ChatResponse addUserToGroup(String chatId, String userId);

    ChatResponse renameGroup(String chatId, String groupName, UserChatRequest userRequest);

    ChatResponse removeUserFromGroup(String chatId, String userId, UserChatRequest userRequest);

    void deleteChat(String chatId, String userId);
}
