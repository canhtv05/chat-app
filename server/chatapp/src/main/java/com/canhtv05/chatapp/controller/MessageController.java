package com.canhtv05.chatapp.controller;

import java.time.Instant;
import java.util.List;
import java.util.Objects;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.canhtv05.chatapp.common.Links;
import com.canhtv05.chatapp.common.Meta;
import com.canhtv05.chatapp.common.Pagination;
import com.canhtv05.chatapp.dto.ApiResponse;
import com.canhtv05.chatapp.dto.response.MessageResponse;
import com.canhtv05.chatapp.dto.resquest.SendMessageRequest;
import com.canhtv05.chatapp.entity.User;
import com.canhtv05.chatapp.service.MessageService;
import com.canhtv05.chatapp.service.UserService;
import com.canhtv05.chatapp.utils.BuildPageUrl;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/messages")
public class MessageController {

    MessageService messageService;
    UserService userService;
    BuildPageUrl buildPageUrl;

    @PostMapping("/send")
    public ApiResponse<MessageResponse> sendMessage(@Valid @RequestBody SendMessageRequest request) {
        User user = userService.getCurrentUser();

        request.setUserId(user.getId());
        Instant timestamp = null;

        if (Objects.isNull(request.getTimestamp())) {
            timestamp = Instant.now();
            request.setTimestamp(timestamp);
        }

        MessageResponse messageResponse = messageService.sendMessage(request);

        return ApiResponse.<MessageResponse>builder().data(messageResponse).build();
    }

    @GetMapping("/chats/{chatId}")
    public ApiResponse<List<MessageResponse>> getChatsMessages(
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", defaultValue = "20", required = false) Integer size,
            @PathVariable String chatId) {
        User user = userService.getCurrentUser();

        var messagesPage = messageService.getChatsMessages(chatId, user, page, size);
        List<MessageResponse> messagesResponses = messagesPage.getContent();

        String url = "/messages/" + chatId + "?page=%d&size=%d";

        long currentPage = (long) messagesPage.getNumber() + 1;
        long totalPages = messagesPage.getTotalPages();

        int safePage = (page == null || page < 1) ? (int) currentPage : page;

        Links links = Links.builder()
                .previous((safePage > 1) ? buildPageUrl.buildPageUrl(url, safePage - 1, size) : null)
                .next((safePage < totalPages) ? buildPageUrl.buildPageUrl(url, safePage + 1, size) : null)
                .build();

        Pagination pagination = Pagination.builder()
                .total(messagesPage.getTotalElements())
                .count((long) messagesPage.getNumberOfElements())
                .perPage((long) messagesPage.getSize())
                .currentPage(currentPage)
                .totalPages(totalPages)
                .links(links)
                .build();

        var meta = Meta.builder().pagination(pagination).build();

        return ApiResponse.<List<MessageResponse>>builder()
                .message("Messages found!")
                .data(messagesResponses)
                .meta(meta)
                .build();
    }

    @DeleteMapping("/{messageId}")
    public ApiResponse<Void> deleteMessage(@PathVariable String messageId) {
        User user = userService.getCurrentUser();

        messageService.deleteMessage(messageId, user);

        return ApiResponse.<Void>builder().message("Message deleted").build();
    }

    @GetMapping("/{chatId}/last-message")
    public ApiResponse<MessageResponse> getLastMessage(@PathVariable String chatId) {
        return ApiResponse.<MessageResponse>builder()
                .data(messageService.getLastMessageByChatId(chatId))
                .build();
    }

    @PostMapping("/upload-image")
    public ApiResponse<String> uploadImage(@RequestParam("file") MultipartFile file) {
        return ApiResponse.<String>builder()
                .data(messageService.uploadImage(file))
                .build();
    }
}
