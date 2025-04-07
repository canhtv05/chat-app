package com.canhtv05.chatapp.dto.response;

import java.io.Serializable;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RefreshTokenResponse implements Serializable {

    String accessToken;
    String refreshToken;
}
