package com.canhtv05.chatapp.service;

import com.canhtv05.chatapp.dto.response.UserResponse;
import com.canhtv05.chatapp.dto.resquest.UserUpdateRequest;

import java.util.List;

public interface UserService {

    UserResponse findUserById(Integer id);

    UserResponse findUserProfile(String jwt);

    UserResponse updateUser(Integer userId, UserUpdateRequest request);

    List<UserResponse> searchUserByFullNameOrEmail(String query);
}
