package com.canhtv05.chatapp.dto.resquest;

import java.io.Serializable;
import java.util.List;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GroupChatCreationRequest implements Serializable {

    List<String> user_ids;
    String chat_name;
    String chat_image;
}
