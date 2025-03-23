package com.canhtv05.chatapp.controller;

import com.canhtv05.chatapp.dto.ApiResponse;
import com.canhtv05.chatapp.dto.response.MessageResponse;
import com.canhtv05.chatapp.dto.resquest.SendMessageRequest;
import com.canhtv05.chatapp.entity.User;
import com.canhtv05.chatapp.service.MessageService;
import com.canhtv05.chatapp.service.UserService;
import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/messages")
public class MessageController {

    MessageService messageService;
    UserService userService;

    @PostMapping("/send")
    public ApiResponse<MessageResponse> sendMessage(@Valid @RequestBody SendMessageRequest request) {
        User user = userService.getCurrentUser();

        request.setUserId(user.getId());

        MessageResponse messageResponse = messageService.sendMessage(request);

        return ApiResponse.<MessageResponse>builder()
                .data(messageResponse)
                .build();
    }

    @GetMapping("/chats/{chatId}")
    public ApiResponse<List<MessageResponse>> getChatsMessages(@PathVariable String chatId) {
        User user = userService.getCurrentUser();

        var messages = messageService.getChatsMessages(chatId, user);

        return ApiResponse.<List<MessageResponse>>builder()
                .data(messages)
                .build();
    }

    @DeleteMapping("/{messageId}")
    public ApiResponse<Void> deleteMessage(@PathVariable String messageId)  {
        User user = userService.getCurrentUser();

        messageService.deleteMessage(messageId, user);

        return ApiResponse.<Void>builder()
                .message("Message deleted")
                .build();
    }
}
