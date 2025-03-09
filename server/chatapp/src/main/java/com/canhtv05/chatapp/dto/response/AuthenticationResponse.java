package com.canhtv05.chatapp.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class AuthenticationResponse {

    String token;
    @JsonProperty("is_auth")
    boolean is_auth;
}
