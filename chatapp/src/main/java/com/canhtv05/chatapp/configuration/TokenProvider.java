package com.canhtv05.chatapp.configuration;

import com.canhtv05.chatapp.constant.JwtConstant;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TokenProvider {

    @NonFinal
    @Value("${jwt.signer-key}")
    String SECRET_KEY;

    String EMAIL = "email";
    SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    public String generateToken(Authentication authentication) {
        return Jwts.builder()
                .issuer("canhtv05")
                .issuedAt(new Date())
                .expiration(new Date(
                        Instant.now().plus(360000, ChronoUnit.SECONDS).toEpochMilli()
                ))
                .subject(authentication.getName())
                .claim(EMAIL, authentication.getName())
                .signWith(key)
                .compact();
    }

    public String getEmailFromToken(String jwt) {
        if (jwt != null && jwt.startsWith("Bearer ")) {
            jwt = jwt.substring(7);
        }

        Claims claims = Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(jwt)
                .getPayload();

        return String.valueOf(claims.get(EMAIL));
    }
}