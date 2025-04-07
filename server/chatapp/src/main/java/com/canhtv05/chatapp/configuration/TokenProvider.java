package com.canhtv05.chatapp.configuration;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

import org.springframework.stereotype.Service;

import com.canhtv05.chatapp.entity.User;
import com.canhtv05.chatapp.exception.AppException;
import com.canhtv05.chatapp.exception.ErrorCode;
import com.canhtv05.chatapp.service.RedisService;
import com.canhtv05.chatapp.utils.JwtUtil;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import io.micrometer.common.util.StringUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TokenProvider {

    static final String EMAIL_CLAIM = "email";
    static final String ISSUER = "canhtv05";

    final JwtUtil jwtUtil;
    final RedisService redisService;

    public String generateAccessToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getId())
                .issuer(ISSUER)
                .issueTime(Date.from(Instant.now()))
                .expirationTime(Date.from(Instant.now().plus(jwtUtil.getValidDuration(), ChronoUnit.SECONDS)))
                .claim(EMAIL_CLAIM, user.getEmail())
                .jwtID(UUID.randomUUID().toString())
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(jwtUtil.getSecretKey()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new IllegalArgumentException(e);
        }
    }

    public String generateRefreshToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);

        var claimsSet = new JWTClaimsSet.Builder()
                .subject(user.getId())
                .issuer(ISSUER)
                .issueTime(Date.from(Instant.now()))
                .expirationTime(new Date(Instant.now()
                        .plus(jwtUtil.getRefreshableDuration(), ChronoUnit.SECONDS)
                        .toEpochMilli()))
                .claim(EMAIL_CLAIM, user.getEmail())
                .jwtID(UUID.randomUUID().toString())
                .build();

        var payload = new Payload(claimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(jwtUtil.getSecretKey()));
        } catch (JOSEException e) {
            throw new IllegalArgumentException(e);
        }
        return jwsObject.serialize();
    }

    public SignedJWT verifyToken(String token) {
        try {
            if (token.startsWith("Bearer")) {
                token = token.replace("Bearer ", "");
            }
            JWSVerifier verifier = new MACVerifier(jwtUtil.getSecretKey());
            SignedJWT signedJWT = SignedJWT.parse(token);

            Date expiration = signedJWT.getJWTClaimsSet().getExpirationTime();

            boolean verified = signedJWT.verify(verifier);
            if (!(verified && expiration.after(Date.from(Instant.now())))) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }

            if (StringUtils.isNotBlank(
                    redisService.get(signedJWT.getJWTClaimsSet().getJWTID()))) {
                throw new AppException(ErrorCode.TOKEN_BLACKLISTED);
            }
            return signedJWT;
        } catch (ParseException | JOSEException e) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
    }

    public String verifyAndExtractEmail(String token) throws ParseException {
        Object emailClaim = this.verifyToken(token).getJWTClaimsSet().getClaim(EMAIL_CLAIM);
        if (Objects.isNull(emailClaim)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        return emailClaim.toString();
    }

    public long verifyAndExtractTokenExpired(String token) throws ParseException {
        Date expiredClaim = this.verifyToken(token).getJWTClaimsSet().getExpirationTime();
        if (Objects.isNull(expiredClaim)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        return expiredClaim.getTime();
    }
}
