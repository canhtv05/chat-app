package com.canhtv05.chatapp.controller;

import com.canhtv05.chatapp.dto.ApiResponse;
import com.canhtv05.chatapp.dto.response.ChatResponse;
import com.canhtv05.chatapp.dto.resquest.GroupChatCreationRequest;
import com.canhtv05.chatapp.dto.resquest.RenameGroupRequest;
import com.canhtv05.chatapp.dto.resquest.SingleChatCreationRequest;
import com.canhtv05.chatapp.entity.User;
import com.canhtv05.chatapp.mapper.ChatMapper;
import com.canhtv05.chatapp.mapper.UserMapper;
import com.canhtv05.chatapp.service.ChatService;
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
@RequestMapping("/chats")
public class ChatController {

    ChatService chatService;
    UserService userService;
    ChatMapper chatMapper;
    UserMapper userMapper;

    @PostMapping("/single")
    public ApiResponse<ChatResponse> creationChat(@RequestBody SingleChatCreationRequest request) {
        User userRequest = userService.getCurrentUser();

        ChatResponse chat = chatService.createChat(userRequest, request.getUserId());

        return ApiResponse.<ChatResponse>builder()
                .data(chat)
                .build();

    }

    @PostMapping("/group")
    public ApiResponse<ChatResponse> creationChatGroup(@RequestBody GroupChatCreationRequest request) {
        User userRequest = userService.getCurrentUser();

        ChatResponse chat = chatService.createGroup(userRequest, request);

        return ApiResponse.<ChatResponse>builder()
                .data(chat)
                .build();

    }

    @GetMapping("/{chatId}")
    public ApiResponse<ChatResponse> findChatById(@PathVariable String chatId) {

        return ApiResponse.<ChatResponse>builder()
                .data(chatMapper.toChatResponse(chatService.findChatById(chatId)))
                .build();

    }

    @GetMapping("/users")
    public ApiResponse<List<ChatResponse>> findAllChatByUserId() {
        User userRequest = userService.getCurrentUser();

        return ApiResponse.<List<ChatResponse>>builder()
                .data(chatService.findAllChatByUserId(userRequest.getId()))
                .build();

    }

    @PutMapping("/{chatId}/add/{userId}")
    public ApiResponse<ChatResponse> addUserToGroup(@PathVariable String chatId, @PathVariable String userId) {
        User userRequest = userService.getCurrentUser();

        ChatResponse chat = chatService.addUserToGroup(chatId, userId, userRequest);

        return ApiResponse.<ChatResponse>builder()
                .data(chat)
                .build();

    }

    @PutMapping("/{chatId}/remove/{userId}")
    public ApiResponse<ChatResponse> removeUserFromGroup(@PathVariable String chatId, @PathVariable String userId) {
        User userRequest = userService.getCurrentUser();

        ChatResponse chat = chatService.removeUserFromGroup(chatId, userId, userRequest);

        return ApiResponse.<ChatResponse>builder()
                .data(chat)
                .build();

    }

    @DeleteMapping("/delete/{chatId}")
    public ApiResponse<Void> deleteChat(@PathVariable String chatId) {
        User userRequest = userService.getCurrentUser();

        chatService.deleteChat(chatId, userRequest.getId());

        return ApiResponse.<Void>builder()
                .message("Chat deleted!")
                .build();

    }

    @PutMapping("rename/{chatId}")
    public ApiResponse<ChatResponse> renameGroup(@PathVariable String chatId,
                                                 @Valid @RequestBody RenameGroupRequest request) {
        User userRequest = userService.getCurrentUser();

        ChatResponse chat = chatService.renameGroup(chatId, request.getGroup_name(), userRequest);

        return ApiResponse.<ChatResponse>builder()
                .data(chat)
                .build();

    }
}
