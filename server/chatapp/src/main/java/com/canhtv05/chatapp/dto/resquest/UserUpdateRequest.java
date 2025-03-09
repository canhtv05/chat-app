package com.canhtv05.chatapp.dto.resquest;

import com.canhtv05.chatapp.validator.DobConstraint;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {

    @Size(min = 3, message = "INVALID_FIRST_NAME")
    String first_name;

    @Size(min = 3, message = "INVALID_LAST_NAME")
    String last_name;

    @NotNull(message = "Gender is not null")
    Boolean gender;

    @DobConstraint(min = 7, message = "INVALID_DOB")
    LocalDate dob;

    String profile_picture;
}
