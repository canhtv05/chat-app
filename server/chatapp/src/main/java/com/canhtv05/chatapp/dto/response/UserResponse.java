package com.canhtv05.chatapp.dto.response;

import java.io.Serializable;

import lombok.*;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse implements Serializable {

    String id;
    String firstName;
    String lastName;
    String email;
    String profilePicture;
}
