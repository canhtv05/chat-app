package com.canhtv05.chatapp.service.impl;

import com.canhtv05.chatapp.dto.response.ChatResponse;
import com.canhtv05.chatapp.dto.resquest.GroupChatCreationRequest;
import com.canhtv05.chatapp.entity.Chat;
import com.canhtv05.chatapp.entity.User;
import com.canhtv05.chatapp.exception.AppException;
import com.canhtv05.chatapp.exception.ErrorCode;
import com.canhtv05.chatapp.mapper.ChatMapper;
import com.canhtv05.chatapp.repository.ChatRepository;
import com.canhtv05.chatapp.service.ChatService;
import com.canhtv05.chatapp.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatServiceImplementation implements ChatService {

    ChatRepository chatRepository;
    UserService userService;
    ChatMapper chatMapper;

    @Override
    public ChatResponse createChat(User userRequest, String userId) {
        User user = userService.findUserById(userId);

        Chat isChatExist = chatRepository.findSingleChatByUserIds(user, userRequest);

        if (!Objects.isNull(isChatExist)) {
            return chatMapper.toChatResponse(isChatExist);
        }

        Chat chat = Chat.builder()
                .createdBy(userRequest)
                .users(new HashSet<>(Set.of(user, userRequest)))
                .isGroup(false)
                .build();

        return chatMapper.toChatResponse(chatRepository.save(chat));
    }

    @Override
    public Chat findChatById(String chatId) {
        return chatRepository.findById(chatId)
                .orElseThrow(() -> new AppException(ErrorCode.CHAT_NOT_FOUND));
    }

    @Override
    public List<ChatResponse> findAllChatByUserId(String userId) {
        User user = userService.findUserById(userId);

        var chats = chatRepository.findChatByUserId(user.getId());

        return chats.stream().map(chatMapper::toChatResponse).toList();
    }

    @Override
    public ChatResponse createGroup(User userRequest, GroupChatCreationRequest request) {
        HashSet<User> users = new HashSet<>();

        for (String userId : request.getUser_ids()) {
            User user = userService.findUserById(userId);
            users.add(user);
        }

        users.add(userRequest);

        Chat chat =
                Chat.builder().isGroup(true).chatImage(request.getChat_image()).chatName(request.getChat_name()).createdBy(userRequest).admins(new HashSet<>(Set.of(userRequest))).users(users).build();

        return chatMapper.toChatResponse(chatRepository.save(chat));
    }

    @Override
    public ChatResponse addUserToGroup(String chatId, String userId, User userRequest) {
        Chat chat = chatRepository.findById(chatId).orElseThrow(() -> new AppException(ErrorCode.CHAT_NOT_FOUND));

        User user = userService.findUserById(userId);

        if (!chat.getAdmins().contains(userRequest) && !chat.getUsers().contains(userRequest) && !chat.getCreatedBy().equals(userRequest)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        chat.getUsers().add(user);

        if (Boolean.FALSE.equals(chat.getIsGroup())) {
            throw new AppException(ErrorCode.CANNOT_ADD_USER_TO_SINGLE_CHAT);
        }

        return chatMapper.toChatResponse(chatRepository.save(chat));
    }

    @Override
    public ChatResponse renameGroup(String chatId, String groupName, User userRequest) {
        Chat chat = chatRepository.findById(chatId).orElseThrow(() -> new AppException(ErrorCode.CHAT_NOT_FOUND));

        if (chat.getUsers().contains(userRequest) && Boolean.TRUE.equals(chat.getIsGroup())) {
            chat.setChatName(groupName);
            return chatMapper.toChatResponse(chatRepository.save(chat));
        }

        throw new AppException(ErrorCode.NOT_IN_GROUP);
    }

    @Override
    public ChatResponse removeUserFromGroup(String chatId, String userId, User userRequest) {
        Chat chat = chatRepository.findById(chatId).orElseThrow(() -> new AppException(ErrorCode.CHAT_NOT_FOUND));

        User user = userService.findUserById(userId);

        if (Boolean.FALSE.equals(chat.getIsGroup())) {
            throw new AppException(ErrorCode.CANNOT_REMOVE_USER_FROM_SINGLE_CHAT);
        }

        if (chat.getAdmins().contains(userRequest)) {
            chat.getUsers().remove(user);
            return chatMapper.toChatResponse(chatRepository.save(chat));
        } else if (chat.getUsers().contains(userRequest)) {
            if (user.getId().equals(userRequest.getId())) {
                chat.getUsers().remove(user);
                return chatMapper.toChatResponse(chatRepository.save(chat));
            }
        } else {
            throw new AppException(ErrorCode.CANT_REMOVE_USER);
        }

        throw new AppException(ErrorCode.CHAT_NOT_FOUND);
    }

    @Transactional
    @Override
    public void deleteChat(String chatId, String userId) {
        Chat chat = chatRepository.findById(chatId).orElseThrow(() -> new AppException(ErrorCode.CHAT_NOT_FOUND));

        User user = userService.findUserById(userId);

        if (Boolean.TRUE.equals(chat.getIsGroup())) {
            if (!chat.getAdmins().contains(user) && !chat.getCreatedBy().equals(user)) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
        } else {
            if (!chat.getCreatedBy().equals(user) && !chat.getUsers().contains(user)) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
        }

        chatRepository.deleteById(chat.getId());
    }
}
