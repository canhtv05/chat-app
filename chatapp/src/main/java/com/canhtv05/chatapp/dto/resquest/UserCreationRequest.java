package com.canhtv05.chatapp.dto.resquest;

import lombok.*;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {

    String email;
    String full_name;
    String password;
}
