package com.canhtv05.chatapp.dto.response;

import java.io.Serializable;
import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageResponse implements Serializable {

    String id;
    String content;
    Instant timestamp;
    UserResponse user;
    String chatId;
    String imageUrl;
}
