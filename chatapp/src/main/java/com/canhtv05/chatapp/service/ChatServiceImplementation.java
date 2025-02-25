package com.canhtv05.chatapp.service;

import com.canhtv05.chatapp.dto.response.ChatResponse;
import com.canhtv05.chatapp.dto.resquest.GroupChatCreationRequest;
import com.canhtv05.chatapp.dto.resquest.UserChatRequest;
import com.canhtv05.chatapp.entity.Chat;
import com.canhtv05.chatapp.entity.User;
import com.canhtv05.chatapp.exception.AppException;
import com.canhtv05.chatapp.exception.ErrorCode;
import com.canhtv05.chatapp.mapper.ChatMapper;
import com.canhtv05.chatapp.mapper.UserMapper;
import com.canhtv05.chatapp.repository.ChatRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

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
    UserMapper userMapper;

    @Override
    public ChatResponse createChat(UserChatRequest request, String userId) {
        User user = userService.findUserById(userId);

        User toUserCreationChat = userMapper.toUserChatRequest(request);

        Chat isChatExist = chatRepository.findSingleChatByUserIds(user, toUserCreationChat);

        if (!Objects.isNull(isChatExist)) {
            return chatMapper.toChatResponse(isChatExist);
        }

        Chat chat = Chat.builder()
                .created_by(toUserCreationChat)
                .users(new HashSet<>(Set.of(user, toUserCreationChat)))
                .is_group(false)
                .build();

        return chatMapper.toChatResponse(chatRepository.save(chat));
    }

    @Override
    public ChatResponse findChatById(String chatId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new AppException(ErrorCode.CHAT_NOT_FOUND));

        return chatMapper.toChatResponse(chat);
    }

    @Override
    public List<ChatResponse> findAllChatByUserId(String userId) {
        User user = userService.findUserById(userId);

        var chats = chatRepository.findChatByUserId(user.getId());

        return chats.stream()
                .map(chatMapper::toChatResponse)
                .toList();
    }

    @Override
    public ChatResponse createGroup(GroupChatCreationRequest request, UserChatRequest userRequest) {
        HashSet<User> users = new HashSet<>();

        for (String userId : request.getUser_ids()) {
            User user = userService.findUserById(userId);
            users.add(user);
        }

        User user = userMapper.toUserChatRequest(userRequest);

        if (users.isEmpty()) {
            users.add(user);
        }

        Chat chat = Chat.builder()
                .is_group(true)
                .chat_image(request.getChat_image())
                .chat_name(request.getChat_name())
                .created_by(user)
                .admins(new HashSet<>(Set.of(user)))
                .users(users)
                .build();

        return chatMapper.toChatResponse(chatRepository.save(chat));
    }

    @Override
    public ChatResponse addUserToGroup(String chatId, String userId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new AppException(ErrorCode.CHAT_NOT_FOUND));

        User user = userService.findUserById(userId);

        chat.getUsers().add(user);

        if (Boolean.FALSE.equals(chat.getIs_group())) {
            throw new AppException(ErrorCode.CANNOT_ADD_USER_TO_SINGLE_CHAT);
        }

        if (chat.getUsers().contains(user)) {
            throw new AppException(ErrorCode.USER_ALREADY_IN_CHAT);
        }

        return chatMapper.toChatResponse(chatRepository.save(chat));
    }

    @Override
    public ChatResponse renameGroup(String chatId, String groupName, UserChatRequest userRequest) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new AppException(ErrorCode.CHAT_NOT_FOUND));

        User user = userMapper.toUserChatRequest(userRequest);

        if (chat.getUsers().contains(user)) {
            chat.setChat_name(groupName);
            return chatMapper.toChatResponse(chatRepository.save(chat));
        }

        throw new AppException(ErrorCode.NOT_IN_GROUP);
    }

    @Override
    public ChatResponse removeUserFromGroup(String chatId, String userId, UserChatRequest userRequest) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new AppException(ErrorCode.CHAT_NOT_FOUND));

        User user = userService.findUserById(userId);
        User userChatRequest = userMapper.toUserChatRequest(userRequest);

        if (Boolean.FALSE.equals(chat.getIs_group())) {
            throw new AppException(ErrorCode.CANNOT_REMOVE_USER_TO_SINGLE_CHAT);
        }

        if (chat.getAdmins().contains(userChatRequest)) {
            chat.getUsers().remove(user);
            return chatMapper.toChatResponse(chatRepository.save(chat));
        } else if (chat.getUsers().contains(userChatRequest)) {
            if (user.getId().equals(userChatRequest.getId())) {
                chat.getUsers().remove(user);
                return chatMapper.toChatResponse(chatRepository.save(chat));
            }
        } else {
            throw new AppException(ErrorCode.CANT_REMOVE_USER);
        }

        throw new AppException(ErrorCode.CHAT_NOT_FOUND);
    }

    @Override
    public void deleteChat(String chatId, String userId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new AppException(ErrorCode.CHAT_NOT_FOUND));

        chatRepository.deleteById(chat.getId());
    }
}
