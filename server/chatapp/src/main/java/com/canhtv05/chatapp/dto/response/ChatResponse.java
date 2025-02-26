package com.canhtv05.chatapp.dto.response;

import com.canhtv05.chatapp.entity.Message;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatResponse {

    String id;
    String chat_name;
    String chat_image;
    Boolean is_group;
    UserResponse created_by;
    Set<UserResponse> users = new HashSet<>();
    List<Message> messages = new ArrayList<>();
}
