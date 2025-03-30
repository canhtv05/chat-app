package com.canhtv05.chatapp.controller;

import com.canhtv05.chatapp.dto.response.MessageResponse;
import com.canhtv05.chatapp.dto.resquest.SendMessageRequest;
import com.canhtv05.chatapp.entity.User;
import com.canhtv05.chatapp.mapper.UserMapper;
import com.canhtv05.chatapp.service.MessageService;
import com.canhtv05.chatapp.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
//@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RealtimeChatController {

    SimpMessagingTemplate simpMessagingTemplate;
    UserService userService;
    UserMapper userMapper;

    @MessageMapping("/message")
//    @SendTo("/group/public")
    public MessageResponse receiveMessage(@Payload SendMessageRequest request) {
        simpMessagingTemplate.convertAndSend("/group/" + request.getChatId(), request);

        User user = userService.findUserById(request.getUserId());

        return MessageResponse.builder()
                .chatId(request.getChatId())
                .content(request.getContent())
                .user(userMapper.toUser(user))
                .build();
    }
}
