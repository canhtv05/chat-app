package com.canhtv05.chatapp.dto.resquest;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserChatRequest {

    String id;
    String full_name;
    String email;
    String profile_picture;
    String password;
}
