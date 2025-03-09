package com.canhtv05.chatapp.controller;

import com.canhtv05.chatapp.constant.JwtConstant;
import com.canhtv05.chatapp.dto.ApiResponse;
import com.canhtv05.chatapp.dto.response.UserResponse;
import com.canhtv05.chatapp.dto.resquest.UserUpdateRequest;
import com.canhtv05.chatapp.entity.User;
import com.canhtv05.chatapp.mapper.UserMapper;
import com.canhtv05.chatapp.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

    UserService userService;
    UserMapper userMapper;

    @GetMapping("/my-info")
    public ApiResponse<UserResponse> getMyInfo(@RequestHeader(JwtConstant.JWT_HEADER) String token) {
        User user = userService.getMyInfo(token);

        return ApiResponse.<UserResponse>builder()
                .data(userMapper.toUserResponse(user))
                .build();
    }

    @GetMapping("/search")
    public ApiResponse<List<UserResponse>> searchUsersByFullNameOrEmail(@RequestParam(value = "query") String query) {
        var users = userService.searchUserByFullNameOrEmail(query);

        return ApiResponse.<List<UserResponse>>builder()
                .data(users)
                .build();
    }

    @PostMapping("/update")
    public ApiResponse<UserResponse> updateUser(@Valid @RequestBody UserUpdateRequest request,
                                                @RequestHeader(JwtConstant.JWT_HEADER) String token) {
        User user = userService.getMyInfo(token);

        user = userService.updateUser(user.getId(), request);
        return ApiResponse.<UserResponse>builder()
                .data(userMapper.toUserResponse(user))
                .build();
    }
}
