package com.canhtv05.chatapp.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageResponse {

    String id;
    String content;
    LocalDateTime timestamp;
    UserResponse user;
    ChatResponse chat;
}