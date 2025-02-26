package com.canhtv05.chatapp.controller;

import com.canhtv05.chatapp.constant.JwtConstant;
import com.canhtv05.chatapp.dto.ApiResponse;
import com.canhtv05.chatapp.dto.response.ChatResponse;
import com.canhtv05.chatapp.dto.resquest.GroupChatCreationRequest;
import com.canhtv05.chatapp.dto.resquest.RenameGroupRequest;
import com.canhtv05.chatapp.dto.resquest.SingleChatCreationRequest;
import com.canhtv05.chatapp.entity.User;
import com.canhtv05.chatapp.service.ChatService;
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
@RequestMapping("/chats")
public class ChatController {

    ChatService chatService;
    UserService userService;


    @PostMapping("/single")
    public ApiResponse<ChatResponse> creationChat(@RequestBody SingleChatCreationRequest request,
                                                  @RequestHeader(JwtConstant.JWT_HEADER) String token) {
        User userRequest = userService.findUserProfile(token);

        ChatResponse chat = chatService.createChat(userRequest, request.getUser_id());

        return ApiResponse.<ChatResponse>builder()
                .data(chat)
                .build();

    }

    @PostMapping("/group")
    public ApiResponse<ChatResponse> creationChatGroup(@RequestBody GroupChatCreationRequest request,
                                                       @RequestHeader(JwtConstant.JWT_HEADER) String token) {
        User userRequest = userService.findUserProfile(token);

        ChatResponse chat = chatService.createGroup(userRequest, request);

        return ApiResponse.<ChatResponse>builder()
                .data(chat)
                .build();

    }

    @GetMapping("/{chatId}")
    public ApiResponse<ChatResponse> findChatById(@PathVariable String chatId) {

        return ApiResponse.<ChatResponse>builder()
                .data(chatService.findChatById(chatId))
                .build();

    }

    @GetMapping("/users")
    public ApiResponse<List<ChatResponse>> findAllChatByUserId(@RequestHeader(JwtConstant.JWT_HEADER) String token) {
        User userRequest = userService.findUserProfile(token);

        return ApiResponse.<List<ChatResponse>>builder()
                .data(chatService.findAllChatByUserId(userRequest.getId()))
                .build();

    }

    @PutMapping("/{chatId}/add/{userId}")
    public ApiResponse<ChatResponse> addUserToGroup(@PathVariable String chatId, @PathVariable String userId,
                                                    @RequestHeader(JwtConstant.JWT_HEADER) String token) {
        User userRequest = userService.findUserProfile(token);

        ChatResponse chat = chatService.addUserToGroup(chatId, userId, userRequest);

        return ApiResponse.<ChatResponse>builder()
                .data(chat)
                .build();

    }

    @GetMapping("/{chatId}/remove/{userId}")
    public ApiResponse<ChatResponse> removeUserFromGroup(@PathVariable String chatId, @PathVariable String userId,
                                                         @RequestHeader(JwtConstant.JWT_HEADER) String token) {
        User userRequest = userService.findUserProfile(token);

        ChatResponse chat = chatService.removeUserFromGroup(chatId, userId, userRequest);

        return ApiResponse.<ChatResponse>builder()
                .data(chat)
                .build();

    }

    @DeleteMapping("/delete/{chatId}")
    public ApiResponse<Void> deleteChat(@PathVariable String chatId,
                                       @RequestHeader(JwtConstant.JWT_HEADER) String token) {
        User userRequest = userService.findUserProfile(token);

        chatService.deleteChat(chatId, userRequest.getId());

        return ApiResponse.<Void>builder()
                .message("Chat deleted!")
                .build();

    }

    @PutMapping("/{chatId}/rename")
    public ApiResponse<ChatResponse> renameGroup(@PathVariable String chatId,
                                                 @Valid @RequestBody RenameGroupRequest request,
                                                 @RequestHeader(JwtConstant.JWT_HEADER) String token) {
        User userRequest = userService.findUserProfile(token);

        ChatResponse chat = chatService.renameGroup(chatId, request.getGroup_name(), userRequest);

        return ApiResponse.<ChatResponse>builder()
                .data(chat)
                .build();

    }
}
