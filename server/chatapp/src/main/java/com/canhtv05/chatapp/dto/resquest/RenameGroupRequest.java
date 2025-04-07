package com.canhtv05.chatapp.dto.resquest;

import java.io.Serializable;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RenameGroupRequest implements Serializable {

    String group_name;
}
