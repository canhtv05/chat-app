package com.canhtv05.chatapp.dto.resquest;

import com.canhtv05.chatapp.common.Gender;
import com.canhtv05.chatapp.validator.DobConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest implements Serializable {

    @Email
    String email;

    @Size(min = 3, message = "INVALID_FIRST_NAME")
    String firstName;

    @Size(min = 3, message = "INVALID_LAST_NAME")
    String lastName;

    @NotNull(message = "Gender is not null")
    Gender gender;

    @DobConstraint(min = 7, message = "INVALID_DOB")
    LocalDate dob;

    @Size(min = 3, message = "INVALID_PASSWORD")
    String password;

    @Size(min = 10, message = "INVALID_PHONE")
    String phone;
}
