package com.canhtv05.chatapp.exception;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(1000, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    UNAUTHENTICATED(1001, "Unauthenticated", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED(1002, "You don't have permission", HttpStatus.UNAUTHORIZED),
    INVALID_KEY(1003, "Invalid key", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1004, "User not found", HttpStatus.NOT_FOUND),
    INVALID_TOKEN(1005, "Invalid token", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND_WITH_EMAIL(1006, "Not found with email", HttpStatus.NOT_FOUND),
    EMAIL_EXISTED(1007, "Email already existed", HttpStatus.CONFLICT),
    CHAT_NOT_FOUND(1008, "Chat not found", HttpStatus.NOT_FOUND),
    CANT_REMOVE_USER(1009, "You can't remove another user", HttpStatus.BAD_REQUEST),
    NOT_IN_GROUP(1010, "You are not member of this group", HttpStatus.BAD_REQUEST),
    CANNOT_ADD_USER_TO_SINGLE_CHAT(1011, "You can't add user to single chat", HttpStatus.BAD_REQUEST),
    CANNOT_REMOVE_USER_TO_SINGLE_CHAT(1012, "You can't remove user to single chat", HttpStatus.BAD_REQUEST),
    USER_ALREADY_IN_CHAT(1013, "User already in chat", HttpStatus.BAD_REQUEST),
    INVALID_FULL_NAME(1014, "Your full name must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1015, "Your password must be at least {min} characters", HttpStatus.BAD_REQUEST),
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
