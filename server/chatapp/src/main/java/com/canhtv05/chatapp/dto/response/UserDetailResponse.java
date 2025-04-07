package com.canhtv05.chatapp.dto.response;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;

import com.canhtv05.chatapp.common.Gender;

import lombok.*;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserDetailResponse implements Serializable {

    String id;
    String firstName;
    String lastName;
    Gender gender;
    LocalDate dob;
    String email;
    String phone;
    String profilePicture;
    Instant createdAt;
    Instant updatedAt;
}
