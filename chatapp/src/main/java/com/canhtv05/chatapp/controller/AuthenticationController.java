package com.canhtv05.chatapp.controller;


import com.canhtv05.chatapp.dto.ApiResponse;
import com.canhtv05.chatapp.dto.response.AuthenticationResponse;
import com.canhtv05.chatapp.dto.resquest.AuthenticationRequest;
import com.canhtv05.chatapp.dto.resquest.UserCreationRequest;
import com.canhtv05.chatapp.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {

    AuthenticationService authenticationService;

    @PostMapping("/sign-up")
    public ApiResponse<AuthenticationResponse> createUser(@Valid @RequestBody UserCreationRequest request) {
        return ApiResponse.<AuthenticationResponse>builder()
                .data(authenticationService.createUser(request))
                .build();
    }

    @PostMapping("/sign-in")
    public ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        return ApiResponse.<AuthenticationResponse>builder()
                .data(authenticationService.authentication(request))
                .build();
    }
}
