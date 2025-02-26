package com.canhtv05.chatapp.mapper;

import com.canhtv05.chatapp.dto.response.ChatResponse;
import com.canhtv05.chatapp.entity.Chat;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ChatMapper {

    ChatResponse toChatResponse(Chat chat);
}
