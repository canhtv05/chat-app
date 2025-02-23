package com.canhtv05.chatapp.exception;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1000, "Invalid key", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1001, "User not found", HttpStatus.NOT_FOUND),
    INVALID_TOKEN(1002, "Invalid token", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND_WITH_EMAIL(1003, "Not found with email", HttpStatus.NOT_FOUND),
    EMAIL_EXISTED(1004, "Email already existed", HttpStatus.CONFLICT),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.BAD_REQUEST),
    ;

    ErrorCode(int code, String message, HttpStatus status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }

    int code;
    String message;
    HttpStatus status;
}
