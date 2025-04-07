package com.canhtv05.chatapp.mapper;

import org.mapstruct.Mapper;

import com.canhtv05.chatapp.dto.response.ChatResponse;
import com.canhtv05.chatapp.entity.Chat;

@Mapper(componentModel = "spring")
public interface ChatMapper {

    ChatResponse toChatResponse(Chat chat);
}
