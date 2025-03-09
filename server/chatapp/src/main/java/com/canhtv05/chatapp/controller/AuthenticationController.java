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
    public ApiResponse<AuthenticationResponse> signup(@RequestBody @Valid UserCreationRequest request) {
        return ApiResponse.<AuthenticationResponse>builder()
                .data(authenticationService.signup(request))
                .build();
    }

    @PostMapping("/sign-in")
    public ApiResponse<AuthenticationResponse> signIn(@RequestBody AuthenticationRequest request) {
        return ApiResponse.<AuthenticationResponse>builder()
                .data(authenticationService.signIn(request))
                .build();
    }
}
