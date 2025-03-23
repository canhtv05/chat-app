package com.canhtv05.chatapp.service;

import com.canhtv05.chatapp.dto.response.UserDetailResponse;
import com.canhtv05.chatapp.dto.response.UserResponse;
import com.canhtv05.chatapp.dto.resquest.UserCreationRequest;
import com.canhtv05.chatapp.dto.resquest.UserUpdateRequest;
import com.canhtv05.chatapp.entity.User;
import org.springframework.data.domain.Page;

public interface UserService {

    UserDetailResponse createUser(UserCreationRequest request);

    User findUserById(String id);

    User getCurrentUser();

    UserDetailResponse updateUser(String userId, UserUpdateRequest request);

    Page<UserResponse> searchUserByFullNameOrEmail(String query, int page, int size);
}
