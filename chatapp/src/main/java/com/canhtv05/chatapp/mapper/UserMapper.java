package com.canhtv05.chatapp.mapper;

import com.canhtv05.chatapp.dto.response.UserResponse;
import com.canhtv05.chatapp.dto.resquest.UserChatRequest;
import com.canhtv05.chatapp.dto.resquest.UserCreationRequest;
import com.canhtv05.chatapp.dto.resquest.UserUpdateRequest;
import com.canhtv05.chatapp.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "profile_picture", ignore = true)
    User toUserRequest(UserCreationRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "password", ignore = true)
    void updateUserFromRequest(UserUpdateRequest request, @MappingTarget User user);

    UserResponse toUserResponse(User user);

    User toUserChatRequest(UserChatRequest request);
}