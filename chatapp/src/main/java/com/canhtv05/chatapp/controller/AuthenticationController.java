package com.canhtv05.chatapp.controller;


import com.canhtv05.chatapp.dto.ApiResponse;
import com.canhtv05.chatapp.dto.response.AuthResponse;
import com.canhtv05.chatapp.dto.resquest.UserCreationRequest;
import com.canhtv05.chatapp.service.AuthService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthController {

    AuthService authService;

    @PostMapping("/signup")
    public ApiResponse<AuthResponse> createUser(@RequestBody UserCreationRequest request) {
        return ApiResponse.<AuthResponse>builder()
                .data(authService.createUser(request))
                .build();
    }

    @PostMapping("/signin")
    public ApiResponse<AuthResponse> login(@ResponseBody LoginRequest)
}
