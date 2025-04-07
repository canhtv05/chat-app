package com.canhtv05.chatapp.service.impl;

import java.time.Instant;
import java.util.Collections;

import org.springframework.data.domain.*;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.canhtv05.chatapp.common.UserStatus;
import com.canhtv05.chatapp.dto.response.UserDetailResponse;
import com.canhtv05.chatapp.dto.response.UserResponse;
import com.canhtv05.chatapp.dto.resquest.UserCreationRequest;
import com.canhtv05.chatapp.dto.resquest.UserUpdateRequest;
import com.canhtv05.chatapp.entity.User;
import com.canhtv05.chatapp.exception.AppException;
import com.canhtv05.chatapp.exception.ErrorCode;
import com.canhtv05.chatapp.mapper.UserMapper;
import com.canhtv05.chatapp.repository.UserRepository;
import com.canhtv05.chatapp.service.UserService;

import io.micrometer.common.util.StringUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImplementation implements UserService {

    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserDetailResponse createUser(UserCreationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new AppException(ErrorCode.PHONE_EXISTED);
        }

        User user = userMapper.toUserRequest(request);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setUserStatus(UserStatus.ACTIVE);

        user = userRepository.save(user);

        return userMapper.toUserResponse(user);
    }

    @Override
    public User findUserById(String id) {
        return userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    @Override
    public User getCurrentUser() {
        try {
            SecurityContext securityContext = SecurityContextHolder.getContext();
            var user = securityContext.getAuthentication().getPrincipal();
            return (User) user;
        } catch (Exception e) {
            log.error("error: {}", e.getMessage());
            return null;
        }
    }

    @Override
    public UserDetailResponse updateUser(String userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        userMapper.updateUserFromRequest(request, user);
        user.setUpdatedAt(Instant.now());

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    public Page<UserResponse> searchUserByFullNameOrEmail(String query, int page, int size) {
        if (page < 1) page = 1;
        if (size < 1) size = 10;
        if (size > 100) size = 100;

        User user = this.getCurrentUser();

        if (StringUtils.isEmpty(query) || query.length() > 100 || query.startsWith(" ")) {
            return new PageImpl<>(Collections.emptyList());
        }

        // client page = 1 => spring jpa page = 0
        int pageIndex = Math.max(page - 1, 0);
        Sort sort = Sort.by(Sort.Order.desc("firstName"), Sort.Order.desc("lastName"), Sort.Order.desc("email"));
        Pageable pageAble = PageRequest.of(pageIndex, size, sort);

        Page<User> userPage =
                userRepository.searchUserByFullNameOrEmailExcludingCurrentUser(query, user.getId(), pageAble);
        return userPage.map(userMapper::toUser);
    }
}
