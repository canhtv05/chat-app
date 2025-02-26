package com.canhtv05.chatapp.configuration;

import com.canhtv05.chatapp.constant.JwtConstant;
import com.canhtv05.chatapp.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TokenProvider {

    String EMAIL = "email";
    SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());

    public String generateToken(User user) {
        return Jwts.builder()
                .issuer("canhtv05")
                .issuedAt(new Date())
                .expiration(new Date(
                        Instant.now().plus(360000, ChronoUnit.SECONDS).toEpochMilli()
                ))
                .subject(user.getId())
                .claim(EMAIL, user.getEmail())
                .signWith(key)
                .compact();
    }

    public String getEmailFromToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        Claims claims = Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getPayload();

        return String.valueOf(claims.get(EMAIL));
    }
}