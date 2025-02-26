package com.canhtv05.chatapp.dto.resquest;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GroupChatCreationRequest {

    List<String> user_ids;

    @NotBlank(message = "Chat name is not blank.")
    String chat_name;
    String chat_image;
}
