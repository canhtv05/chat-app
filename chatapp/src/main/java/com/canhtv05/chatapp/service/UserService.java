package com.canhtv05.chatapp.service;

import com.canhtv05.chatapp.dto.resquest.UserUpdateRequest;
import com.canhtv05.chatapp.entity.User;

import java.util.List;

public interface UserService {

    User findUserById(Integer id);

    User findUserProfile(String jwt);

    User updateUser(Integer userId, UserUpdateRequest request) throws Exception;

    List<User> searchUser(String query);
}
