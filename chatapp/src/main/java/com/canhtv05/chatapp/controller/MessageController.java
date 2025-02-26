package com.canhtv05.chatapp.controller;

import com.canhtv05.chatapp.constant.JwtConstant;
import com.canhtv05.chatapp.dto.ApiResponse;
import com.canhtv05.chatapp.dto.response.MessageResponse;
import com.canhtv05.chatapp.dto.resquest.SendMessageRequest;
import com.canhtv05.chatapp.entity.User;
import com.canhtv05.chatapp.service.MessageService;
import com.canhtv05.chatapp.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/messages")
public class MessageController {

    MessageService messageService;
    UserService userService;

    @PostMapping("/send")
    public ApiResponse<MessageResponse> sendMessage(@Valid @RequestBody SendMessageRequest request,
                                                    @RequestHeader(JwtConstant.JWT_HEADER) String token) {
        User user = userService.findUserProfile(token);

        request.setUser_id(user.getId());

        MessageResponse messageResponse = messageService.sendMessage(request);

        return ApiResponse.<MessageResponse>builder()
                .data(messageResponse)
                .build();
    }

    @GetMapping("/chats/{chatId}")
    public ApiResponse<List<MessageResponse>> getChatsMessages(@PathVariable String chatId,
                                                               @RequestHeader(JwtConstant.JWT_HEADER) String token) {
        User user = userService.findUserProfile(token);

        var messages = messageService.getChatsMessages(chatId, user);

        return ApiResponse.<List<MessageResponse>>builder()
                .data(messages)
                .build();
    }

    @DeleteMapping("/{messageId}")
    public ApiResponse<Void> deleteMessage(@PathVariable String messageId,
                                           @RequestHeader(JwtConstant.JWT_HEADER) String token) {
        User user = userService.findUserProfile(token);

        messageService.deleteMessage(messageId, user);

        return ApiResponse.<Void>builder()
                .message("Message deleted")
                .build();
    }
}
