package com.canhtv05.chatapp.dto.resquest;

import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {

    String email;

    @Size(min = 3, message = "INVALID_FULL_NAME")
    String full_name;

    @Size(min = 3, message = "INVALID_PASSWORD")
    String password;
}
