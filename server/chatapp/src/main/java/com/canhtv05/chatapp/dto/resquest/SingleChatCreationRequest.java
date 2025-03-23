package com.canhtv05.chatapp.dto.resquest;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SingleChatCreationRequest implements Serializable {

    String userId;
}
