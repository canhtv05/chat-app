package com.canhtv05.chatapp.dto.resquest;

import java.io.Serializable;

import lombok.*;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LogoutRequest implements Serializable {

    String accessToken;
}
