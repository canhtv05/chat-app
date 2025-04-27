package com.canhtv05.chatapp.controller;

import com.canhtv05.chatapp.dto.resquest.SingleChatRealTimeCreationRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

import com.canhtv05.chatapp.dto.response.MessageResponse;
import com.canhtv05.chatapp.dto.resquest.SendMessageRequest;
import com.canhtv05.chatapp.entity.User;
import com.canhtv05.chatapp.mapper.UserMapper;
import com.canhtv05.chatapp.service.UserService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Slf4j
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RealtimeChatController {

    SimpMessagingTemplate simpMessagingTemplate;
    UserService userService;
    UserMapper userMapper;

    @MessageMapping("/message")
    public void receiveMessage(@Payload SendMessageRequest request) {
        User user = userService.findUserById(request.getUserId());

        var response = MessageResponse.builder()
                .chatId(request.getChatId())
                .content(request.getContent())
                .user(userMapper.toUser(user))
                .timestamp(request.getTimestamp())
                .imageUrl(request.getImageUrl())
                .build();

        simpMessagingTemplate.convertAndSend("/group/" + request.getChatId(), response);
    }

    @MessageMapping("/single-chat-created")
    public void createChat(@Payload SingleChatRealTimeCreationRequest request) {
        simpMessagingTemplate.convertAndSend( "/create-single-chat", request);
    }
}
