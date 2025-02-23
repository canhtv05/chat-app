package com.canhtv05.chatapp.service;

import com.canhtv05.chatapp.configuration.TokenProvider;
import com.canhtv05.chatapp.dto.response.UserResponse;
import com.canhtv05.chatapp.dto.resquest.UserUpdateRequest;
import com.canhtv05.chatapp.entity.User;
import com.canhtv05.chatapp.exception.AppException;
import com.canhtv05.chatapp.exception.ErrorCode;
import com.canhtv05.chatapp.mapper.UserMapper;
import com.canhtv05.chatapp.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImplementation implements UserService {

    UserRepository userRepository;
    UserMapper userMapper;

    TokenProvider tokenProvider;

    @Override
    public UserResponse findUserById(Integer id) {
        return userMapper.toUserResponse(userRepository
                .findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND)));
    }

    @Override
    public UserResponse findUserProfile(String jwt) {
        String email = tokenProvider.getEmailFromToken(jwt);

        if (Objects.isNull(email)) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }

        User user = userRepository.findByEmail(email);

        if (Objects.isNull(user)) {
            throw new AppException(ErrorCode.USER_NOT_FOUND_WITH_EMAIL);
        }

        return userMapper.toUserResponse(user);
    }

    @Override
    public UserResponse updateUser(Integer userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        userMapper.updateUserFromRequest(request, user);

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    public List<UserResponse> searchUserByFullNameOrEmail(String query) {
        return userRepository.searchUserByFullNameOrEmail(query).stream()
                .map(userMapper::toUserResponse)
                .toList();
    }
}
