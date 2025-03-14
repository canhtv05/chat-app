package com.canhtv05.chatapp.service;

import com.canhtv05.chatapp.dto.response.UserResponse;
import com.canhtv05.chatapp.dto.resquest.UserUpdateRequest;
import com.canhtv05.chatapp.entity.User;

import java.util.List;

public interface UserService {

    User findUserById(String id);

    User getMyInfo(String jwt);

    User updateUser(String userId, UserUpdateRequest request);

    List<UserResponse> searchUserByFullNameOrEmail(String query);
}
