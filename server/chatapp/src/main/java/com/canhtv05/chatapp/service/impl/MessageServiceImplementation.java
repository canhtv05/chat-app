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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

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
                .timestamp(Instant.now())
                .content(request.getContent())
                .build();

        return messageMapper.toMessageResponse(messageRepository.save(message));
    }

    @Override
    public Page<MessageResponse> getChatsMessages(String chatId, User userRequest, Integer page, Integer size) {
        if (size < 1) size = 20;
        if (size > 100) size = 100;

        long totalMessages = messageRepository.countByChatId(chatId);
        int totalPages = (int) Math.ceil((double) totalMessages / size);

        Chat chat = chatService.findChatById(chatId);

        int pageIndex = (Objects.isNull(page) || page < 1) ? Math.max(totalPages - 1, 0) : page - 1;

        Sort sort = Sort.by(Sort.Direction.ASC, "timestamp");
        Pageable pageable = PageRequest.of(pageIndex, size, sort);

        if (!chat.getUsers().contains(userRequest) && !chat.getAdmins().contains(userRequest) && !chat.getCreatedBy().equals(userRequest)) {
            throw new AppException(ErrorCode.NOT_RELATED_TO_CHAT);
        }

        Page<Message> messagePage = messageRepository.findByChatId(chatId, pageable);

        return messagePage.map(messageMapper::toMessageResponse);
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
