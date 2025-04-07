package com.canhtv05.chatapp.dto.resquest;

import java.io.Serializable;
import java.time.Instant;

import jakarta.validation.constraints.NotBlank;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SendMessageRequest implements Serializable {

    String userId;
    String chatId;

    @NotBlank(message = "Content can't be blank")
    String content;

    Instant timestamp;
}
