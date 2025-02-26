package com.canhtv05.chatapp.mapper;

import com.canhtv05.chatapp.dto.response.MessageResponse;
import com.canhtv05.chatapp.entity.Message;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MessageMapper {

    MessageResponse toMessageResponse(Message message);

}
