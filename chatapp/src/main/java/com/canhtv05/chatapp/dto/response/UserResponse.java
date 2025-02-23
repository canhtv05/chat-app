package com.canhtv05.chatapp.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {

    Integer id;
    String full_name;
    String email;
    String profile_picture;
    String password;
}
