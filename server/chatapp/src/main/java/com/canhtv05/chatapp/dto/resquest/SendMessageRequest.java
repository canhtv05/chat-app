package com.canhtv05.chatapp.dto.resquest;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SendMessageRequest implements Serializable {

    String user_id;
    String chat_id;

    @NotBlank(message = "Content can't be blank")
    String content;
}
