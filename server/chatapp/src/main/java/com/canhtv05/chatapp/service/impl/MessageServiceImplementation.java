package com.canhtv05.chatapp.service.impl;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.Objects;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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
import com.cloudinary.Cloudinary;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MessageServiceImplementation implements MessageService {

    MessageRepository messageRepository;
    UserService userService;
    ChatService chatService;
    MessageMapper messageMapper;
    Cloudinary cloudinary;

    @Override
    public MessageResponse sendMessage(SendMessageRequest request) {
        User user = userService.findUserById(request.getUserId());

        Chat chat = chatService.findChatById(request.getChatId());

        if (!chat.getUsers().contains(user) && !chat.getAdmins().contains(user)) {
            throw new AppException(ErrorCode.NOT_RELATED_TO_CHAT);
        }

        Message message = Message.builder()
                .chat(chat)
                .user(user)
                .timestamp(Instant.now())
                .content(request.getContent())
                .imageUrl(request.getImageUrl())
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

        log.info(
                "check 1: {}, check 2: {}, check 3: {}",
                chat.getUsers(),
                !chat.getAdmins().contains(userRequest),
                !chat.getCreatedBy().equals(userRequest));

        if (!chat.getUsers().contains(userRequest)
                && !chat.getAdmins().contains(userRequest)
                && !chat.getCreatedBy().equals(userRequest)) {
            throw new AppException(ErrorCode.NOT_RELATED_TO_CHAT);
        }

        Page<Message> messagePage = messageRepository.findByChatId(chatId, pageable);

        return messagePage.map(messageMapper::toMessageResponse);
    }

    @Override
    public Message findMessageById(String messageId, User userRequest) {
        Message message =
                messageRepository.findById(messageId).orElseThrow(() -> new AppException(ErrorCode.MESSAGE_NOT_FOUND));

        Chat chat = message.getChat();
        if (!chat.getUsers().contains(userRequest)
                && !chat.getAdmins().contains(userRequest)
                && !chat.getCreatedBy().equals(userRequest)) {
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

    @Override
    public MessageResponse getLastMessageByChatId(String chatId) {
        Message message = messageRepository.getLastMessageByChatId(chatId);
        return messageMapper.toMessageResponse(message);
    }

    @Override
    public String uploadImage(MultipartFile file) {
        try {
            Map<String, Object> uploadResult =
                    cloudinary.uploader().upload(file.getBytes(), Map.of("resource_type", "image"));
            return (String) uploadResult.get("secure_url");
        } catch (IOException | AppException e) {
            throw new AppException(ErrorCode.UPLOAD_FAILED);
        }
    }
}
