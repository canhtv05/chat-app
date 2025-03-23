package com.canhtv05.chatapp.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageResponse implements Serializable {

    String id;
    String content;
    LocalDateTime timestamp;
    UserResponse user;
    String chatId;
}