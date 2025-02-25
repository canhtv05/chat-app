package com.canhtv05.chatapp.service;

import com.canhtv05.chatapp.configuration.TokenProvider;
import com.canhtv05.chatapp.dto.response.AuthenticationResponse;
import com.canhtv05.chatapp.dto.resquest.AuthenticationRequest;
import com.canhtv05.chatapp.dto.resquest.UserCreationRequest;
import com.canhtv05.chatapp.entity.User;
import com.canhtv05.chatapp.exception.AppException;
import com.canhtv05.chatapp.exception.ErrorCode;
import com.canhtv05.chatapp.mapper.UserMapper;
import com.canhtv05.chatapp.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {

    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    TokenProvider tokenProvider;
    CustomUserDetailService customUserDetailService;

    public AuthenticationResponse createUser(UserCreationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        User user = userMapper.toUserRequest(request);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        userRepository.save(user);

        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = tokenProvider.generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .is_auth(true)
                .build();
    }

    public AuthenticationResponse authentication(AuthenticationRequest request) {
        UserDetails userDetails = customUserDetailService.loadUserByUsername(request.getEmail());

        if (Objects.isNull(userDetails)) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        if (!passwordEncoder.matches(request.getPassword(), userDetails.getPassword())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND_WITH_EMAIL));

        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null,
                userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = tokenProvider.generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .is_auth(true)
                .build();
    }
}
