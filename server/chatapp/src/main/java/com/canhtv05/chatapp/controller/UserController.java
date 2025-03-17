package com.canhtv05.chatapp.controller;

import com.canhtv05.chatapp.common.Meta;
import com.canhtv05.chatapp.common.Pagination;
import com.canhtv05.chatapp.dto.ApiResponse;
import com.canhtv05.chatapp.dto.response.UserResponse;
import com.canhtv05.chatapp.dto.resquest.UserCreationRequest;
import com.canhtv05.chatapp.dto.resquest.UserUpdateRequest;
import com.canhtv05.chatapp.mapper.UserMapper;
import com.canhtv05.chatapp.service.UserService;
import com.nimbusds.jose.JOSEException;
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

    @GetMapping("/search")
    public ApiResponse<List<UserResponse>> searchUsersByFullNameOrEmail(@RequestParam(value = "q") String query) {
        var users = userService.searchUserByFullNameOrEmail(query);
        var meta = Meta.builder().pagination(Pagination.builder().build()).build();

        return ApiResponse.<List<UserResponse>>builder()
                .message("Users found!")
                .data(users)
                .meta(meta)
                .build();
    }
}
