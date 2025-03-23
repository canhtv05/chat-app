package com.canhtv05.chatapp.mapper;

import com.canhtv05.chatapp.dto.response.UserDetailResponse;
import com.canhtv05.chatapp.dto.response.UserResponse;
import com.canhtv05.chatapp.dto.resquest.UserCreationRequest;
import com.canhtv05.chatapp.dto.resquest.UserUpdateRequest;
import com.canhtv05.chatapp.entity.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "userStatus", ignore = true)
    @Mapping(target = "profilePicture", ignore = true)
    User toUserRequest(UserCreationRequest request);

    @Mapping(target = "userStatus", ignore = true)
    @Mapping(target = "email", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateUserFromRequest(UserUpdateRequest request, @MappingTarget User user);

    UserDetailResponse toUserResponse(User user);

    UserResponse toUser(User user);
}