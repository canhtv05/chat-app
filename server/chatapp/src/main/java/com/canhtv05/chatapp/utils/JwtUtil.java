package com.canhtv05.chatapp.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    @Value("${jwt.secretKey}")
    private String secretKey;

    @Value("${jwt.valid-duration}")
    private Long VALID_DURATION;

    @Value("${jwt.refreshable-duration}")
    private Long REFRESHABLE_DURATION;

    public byte[] getSecretKey() {
        return secretKey.getBytes();
    }

    public Long getValidDuration() {
        return VALID_DURATION;
    }

    public Long getRefreshableDuration() {
        return REFRESHABLE_DURATION;
    }
}
