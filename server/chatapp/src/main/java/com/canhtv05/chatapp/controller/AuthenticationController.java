package com.canhtv05.chatapp.controller;


import com.canhtv05.chatapp.common.Meta;
import com.canhtv05.chatapp.dto.ApiResponse;
import com.canhtv05.chatapp.dto.response.LoginResponse;
import com.canhtv05.chatapp.dto.response.UserDetailResponse;
import com.canhtv05.chatapp.dto.resquest.AuthenticationRequest;
import com.canhtv05.chatapp.dto.resquest.UserCreationRequest;
import com.canhtv05.chatapp.dto.resquest.UserUpdateRequest;
import com.canhtv05.chatapp.entity.User;
import com.canhtv05.chatapp.mapper.UserMapper;
import com.canhtv05.chatapp.service.AuthenticationService;
import com.canhtv05.chatapp.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {

    AuthenticationService authenticationService;
    UserMapper userMapper;
    UserService userService;

    @PostMapping("/register")
    public ApiResponse<UserDetailResponse> register(@RequestBody @Valid UserCreationRequest request) {
        var user = userService.createUser(request);

        return ApiResponse.<UserDetailResponse>builder()
                .message("User registered!")
                .data(user)
                .build();
    }

    @PostMapping("/login")
    public ApiResponse<?> login(@RequestBody AuthenticationRequest request, HttpServletResponse response){
        LoginResponse loginResponse = authenticationService.login(request, response);
        User user = userService.findUserById(loginResponse.getUserId());
        UserDetailResponse userResponse = userMapper.toUserResponse(user);
        loginResponse.setUserId(null);

        Meta<LoginResponse> meta = Meta.<LoginResponse>builder()
                .tokenInfo(loginResponse)
                .build();

        return ApiResponse.builder()
                .message("Login successful!")
                .meta(meta)
                .data(userResponse)
                .build();
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestHeader(HttpHeaders.AUTHORIZATION) String token, HttpServletResponse response) throws ParseException{
        authenticationService.logout(token, response);
        return ApiResponse.<Void>builder()
                .message("Logout successful!")
                .build();
    }

    @PostMapping("/refresh-token")
    public ApiResponse<?> refreshToken(@CookieValue(name = "refreshToken") String refreshToken) throws ParseException {
        var data = authenticationService.refreshToken(refreshToken);
        return ApiResponse.builder()
                .message("Refresh token successful!")
                .data(data)
                .build();
    }

    @GetMapping("/me")
    public ApiResponse<UserDetailResponse> getMyInfo() {
        var user = userService.getCurrentUser();

        return ApiResponse.<UserDetailResponse>builder()
                .message("User found!")
                .data(userMapper.toUserResponse(user))
                .build();
    }

    @PatchMapping("/me/update")
    public ApiResponse<UserDetailResponse> updateUser(@Valid @RequestBody UserUpdateRequest request) {
        var user = userService.getCurrentUser();

        return ApiResponse.<UserDetailResponse>builder()
                .message("User updated!")
                .data(userService.updateUser(user.getId(), request))
                .build();
    }
}
