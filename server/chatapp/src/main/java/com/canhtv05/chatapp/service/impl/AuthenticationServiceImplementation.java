package com.canhtv05.chatapp.service.impl;

import com.canhtv05.chatapp.configuration.TokenProvider;
import com.canhtv05.chatapp.dto.response.LoginResponse;
import com.canhtv05.chatapp.dto.response.RefreshTokenResponse;
import com.canhtv05.chatapp.dto.resquest.AuthenticationRequest;
import com.canhtv05.chatapp.entity.User;
import com.canhtv05.chatapp.exception.AppException;
import com.canhtv05.chatapp.exception.ErrorCode;
import com.canhtv05.chatapp.repository.UserRepository;
import com.canhtv05.chatapp.service.AuthenticationService;
import com.canhtv05.chatapp.service.RedisService;
import com.canhtv05.chatapp.utils.JwtUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.micrometer.common.util.StringUtils;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationServiceImplementation implements AuthenticationService {

    UserRepository userRepository;
    TokenProvider tokenProvider;
    AuthenticationManager authenticationManager;
    JwtUtil jwtUtil;
    RedisService redisService;

    @Value("${app.name}")
    private static String KEY;

    @Override
    public LoginResponse login(AuthenticationRequest request, HttpServletResponse response) {
        Authentication authentication = null;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            // not found account
        } catch (InternalAuthenticationServiceException | BadCredentialsException e) {
            throw new AppException(ErrorCode.INVALID_EMAIL_OR_PASSWORD);
        }

        User user = (User) authentication.getPrincipal();

        String accessToken = tokenProvider.generateAccessToken(user);
        String refreshToken = tokenProvider.generateRefreshToken(user);
        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        Cookie cookie = setCookie(accessToken, refreshToken);
        response.addCookie(cookie);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .accessTokenTTL(jwtUtil.getValidDuration())
                .refreshTokenTTL(jwtUtil.getRefreshableDuration())
                .refreshToken(refreshToken)
                .userId(user.getId())
                .build();
    }

    @Override
    public void logout(String accessToken, HttpServletResponse response) throws ParseException {
        String email = tokenProvider.verifyAndExtractEmail(accessToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        long accessTokenExpired = tokenProvider.verifyAndExtractTokenExpired(accessToken);
        long currentTime = System.currentTimeMillis();

        // con han
        if (currentTime < accessTokenExpired) {
            try {
                String jwtId = tokenProvider.verifyToken(accessToken).getJWTClaimsSet().getJWTID();

                long ttl = accessTokenExpired - currentTime;
                redisService.save(jwtId, accessToken, ttl, TimeUnit.MILLISECONDS);

                user.setRefreshToken(null);
                userRepository.save(user);

                deleteCookie(response);

                SecurityContextHolder.clearContext();
            } catch (ParseException e) {
                throw new AppException(ErrorCode.INVALID_TOKEN);
            }
        }
    }

    @Override
    public RefreshTokenResponse refreshToken(String refreshToken, HttpServletResponse response) throws ParseException {
        if (StringUtils.isBlank(refreshToken)) {
            throw new AppException(ErrorCode.REFRESH_TOKEN_INVALID);
        }

        String email = tokenProvider.verifyAndExtractEmail(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (!Objects.equals(user.getRefreshToken(), refreshToken) || StringUtils.isBlank(user.getRefreshToken())) {
            throw new AppException(ErrorCode.REFRESH_TOKEN_INVALID);
        }

        var signJWT = tokenProvider.verifyToken(refreshToken);
        if (Objects.isNull(signJWT)) {
            throw new AppException(ErrorCode.REFRESH_TOKEN_INVALID);
        }

        String accessToken = tokenProvider.generateAccessToken(user);
        String generateRefreshToken = tokenProvider.generateRefreshToken(user);

        Cookie cookie = setCookie(accessToken, generateRefreshToken);
        response.addCookie(cookie);

        user.setRefreshToken(generateRefreshToken);
        userRepository.save(user);

        return RefreshTokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(generateRefreshToken)
                .build();
    }

    private Cookie setCookie(String accessToken, String refreshToken) {
        Map<String, String> tokenData = new HashMap<>();
        tokenData.put("accessToken", accessToken);
        tokenData.put("refreshToken", refreshToken);

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonData;

        try {
            jsonData = objectMapper.writeValueAsString(tokenData);
        } catch (JsonProcessingException | AppException e) {
            throw new AppException(ErrorCode.JSON_PROCESSING_ERROR);
        }

        // replace các kí tự sao cho giống với thư viện js-cookie
        // https://www.npmjs.com/package/js-cookie
        String formattedJsonData = jsonData.replace("\"", "%22").replace(",", "%2C");

        Cookie cookie = new Cookie("MY_CHAT_APP", formattedJsonData);
        // cookie.setHttpOnly(true);

        // cho phép lấy cookie từ phía client
        cookie.setHttpOnly(false);
        cookie.setMaxAge(jwtUtil.getRefreshableDuration().intValue()); // 2 weeks
        cookie.setPath("/");
        cookie.setSecure(true); // true nếu chỉ cho gửi qua HTTPS
        cookie.setDomain("localhost");
        return cookie;
    }

    public void deleteCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie(KEY, "");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        cookie.setSecure(true);
        cookie.setDomain("localhost");
        response.addCookie(cookie);
    }
}
