package com.canhtv05.chatapp.service.impl;

import com.canhtv05.chatapp.dto.response.MessageResponse;
import com.canhtv05.chatapp.dto.resquest.SendMessageRequest;
import com.canhtv05.chatapp.entity.Chat;
import com.canhtv05.chatapp.entity.Message;
import com.canhtv05.chatapp.entity.User;
import com.canhtv05.chatapp.exception.AppException;
import com.canhtv05.chatapp.exception.ErrorCode;
import com.canhtv05.chatapp.mapper.MessageMapper;
import com.canhtv05.chatapp.repository.MessageRepository;
import com.canhtv05.chatapp.service.ChatService;
import com.canhtv05.chatapp.service.MessageService;
import com.canhtv05.chatapp.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MessageServiceImplementation implements MessageService {

    MessageRepository messageRepository;
    UserService userService;
    ChatService chatService;
    MessageMapper messageMapper;

    @Override
    public MessageResponse sendMessage(SendMessageRequest request) {
        User user = userService.findUserById(request.getUserId());

        Chat chat = chatService.findChatById(request.getChatId());

        if  (!chat.getUsers().contains(user) && !chat.getAdmins().contains(user)) {
            throw new AppException(ErrorCode.NOT_RELATED_TO_CHAT);
        }

        Message message = Message.builder()
                .chat(chat)
                .user(user)
                .timestamp(LocalDateTime.now())
                .content(request.getContent())
                .build();

        return messageMapper.toMessageResponse(messageRepository.save(message));
    }

    @Override
    public List<MessageResponse> getChatsMessages(String chatId, User userRequest) {
        Chat chat = chatService.findChatById(chatId);

        log.info("1: {}, 2: {}, 3: {}", !chat.getUsers().contains(userRequest),
                !chat.getAdmins().contains(userRequest), !chat.getCreatedBy().equals(userRequest));

        log.info("email: {}",userRequest.getEmail());

        log.info("o: {}", chat.getUsers().stream()
                .map(User::getEmail)  // Lấy email của từng user
                .collect(Collectors.toList())); // Chuyển thành danh sách


        if (!chat.getUsers().contains(userRequest) && !chat.getAdmins().contains(userRequest) && !chat.getCreatedBy().equals(userRequest)) {
            throw new AppException(ErrorCode.NOT_RELATED_TO_CHAT);
        }

        return messageRepository.findByChatId(chatId).stream()
                .map(messageMapper::toMessageResponse)
                .sorted(Comparator.comparing(MessageResponse::getTimestamp))
                .toList();
    }

    @Override
    public Message findMessageById(String messageId, User userRequest) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new AppException(ErrorCode.MESSAGE_NOT_FOUND));

        Chat chat = message.getChat();
        if (!chat.getUsers().contains(userRequest) && !chat.getAdmins().contains(userRequest) && !chat.getCreatedBy().equals(userRequest)) {
            throw new AppException(ErrorCode.NOT_RELATED_TO_CHAT);
        }

        return message;
    }

    @Transactional
    @Override
    public void deleteMessage(String messageId, User userRequest) {
        Message message = findMessageById(messageId, userRequest);

        if (message.getUser().getEmail().equals(userRequest.getEmail())) {
            messageRepository.deleteById(messageId);
        } else {
            throw new AppException(ErrorCode.CANT_DELETE_OTHER_MESSAGE);
        }
    }
}
