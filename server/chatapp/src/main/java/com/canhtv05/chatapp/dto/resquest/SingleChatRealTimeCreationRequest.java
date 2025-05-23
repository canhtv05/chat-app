package com.canhtv05.chatapp.dto.resquest;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

import com.canhtv05.chatapp.dto.response.UserResponse;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SingleChatRealTimeCreationRequest {

    String id;
    String chatName;
    String chatImage;
    Boolean isGroup;
    UserResponse createdBy;

    @Builder.Default
    Set<UserResponse> users = new HashSet<>();

    String content;
    Instant timestamp;
    String chatId;
}
