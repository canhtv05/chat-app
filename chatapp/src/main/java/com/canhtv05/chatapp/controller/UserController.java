package com.canhtv05.chatapp.controller;

import com.canhtv05.chatapp.constant.JwtConstant;
import com.canhtv05.chatapp.dto.ApiResponse;
import com.canhtv05.chatapp.dto.response.UserResponse;
import com.canhtv05.chatapp.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

    UserService userService;

    @GetMapping
    public ApiResponse<UserResponse> getUserProfile(@RequestHeader(JwtConstant.JWT_HEADER) String token) {
        UserResponse user = userService.findUserProfile(token);

        return ApiResponse.<UserResponse>builder()
                .data(user)
                .build();
    }
}
