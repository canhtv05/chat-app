package com.canhtv05.chatapp.service;

import com.canhtv05.chatapp.dto.response.UserResponse;
import com.canhtv05.chatapp.dto.resquest.UserCreationRequest;
import com.canhtv05.chatapp.dto.resquest.UserUpdateRequest;
import com.canhtv05.chatapp.entity.User;

import java.util.List;

public interface UserService {

    UserResponse createUser(UserCreationRequest request);

    User findUserById(String id);

    User getCurrentUser();

    UserResponse updateUser(String userId, UserUpdateRequest request);

    List<UserResponse> searchUserByFullNameOrEmail(String query);
}
