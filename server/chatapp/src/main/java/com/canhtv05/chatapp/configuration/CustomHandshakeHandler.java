package com.canhtv05.chatapp.configuration;

import com.canhtv05.chatapp.exception.AppException;
import com.canhtv05.chatapp.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.text.ParseException;
import java.util.Map;

@RequiredArgsConstructor
public class CustomHandshakeHandler extends DefaultHandshakeHandler {

    private final TokenProvider tokenProvider;

    @Override
    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes)  {
        String token = (String) attributes.get(HttpHeaders.AUTHORIZATION);

        if (token == null) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        String email = null;
        try {
            email = tokenProvider.verifyAndExtractEmail(request);
        } catch (ParseException e) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }

        return new CustomPrincipal(email);
    }
}
