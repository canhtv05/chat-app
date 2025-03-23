package com.canhtv05.chatapp.mapper;

import com.canhtv05.chatapp.dto.response.MessageResponse;
import com.canhtv05.chatapp.entity.Message;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MessageMapper {

    @Mapping(target = "chatId", source = "chat.id")
    MessageResponse toMessageResponse(Message message);

}
