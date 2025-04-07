package com.canhtv05.chatapp.service;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;

import jakarta.servlet.http.HttpServletResponse;

import com.canhtv05.chatapp.dto.response.LoginResponse;
import com.canhtv05.chatapp.dto.response.RefreshTokenResponse;
import com.canhtv05.chatapp.dto.resquest.AuthenticationRequest;

public interface AuthenticationService {

    LoginResponse login(AuthenticationRequest request, HttpServletResponse response)
            throws UnsupportedEncodingException;

    RefreshTokenResponse refreshToken(String refreshToken, HttpServletResponse response) throws ParseException;

    void logout(String token, HttpServletResponse response) throws ParseException;
}
