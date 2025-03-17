package com.canhtv05.chatapp.service;

import com.canhtv05.chatapp.dto.response.LoginResponse;
import com.canhtv05.chatapp.dto.response.RefreshTokenResponse;
import com.canhtv05.chatapp.dto.resquest.AuthenticationRequest;
import com.canhtv05.chatapp.dto.resquest.LogoutRequest;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.HttpServletResponse;

import java.text.ParseException;

public interface AuthenticationService {

    LoginResponse login(AuthenticationRequest request, HttpServletResponse response);

    RefreshTokenResponse refreshToken(String refreshToken) throws ParseException, JOSEException;

    void logout(LogoutRequest request, HttpServletResponse response) throws ParseException;
}
