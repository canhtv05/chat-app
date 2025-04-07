package com.canhtv05.chatapp.dto.response;

import java.io.Serializable;
import java.util.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

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
}
