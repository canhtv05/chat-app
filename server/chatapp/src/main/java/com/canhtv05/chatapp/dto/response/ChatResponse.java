package com.canhtv05.chatapp.dto.response;

import com.canhtv05.chatapp.entity.Message;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatResponse implements Serializable {

    String id;
    String chatName;
    String chatImage;
    Boolean isGroup;
    UserResponse createdBy;
    Set<UserResponse> users = new HashSet<>();
    List<Message> messages = new ArrayList<>();
}
