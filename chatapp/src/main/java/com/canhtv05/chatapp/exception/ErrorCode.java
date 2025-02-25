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
    INVALID_KEY(1002, "Invalid key", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1003, "User not found", HttpStatus.NOT_FOUND),
    INVALID_TOKEN(1004, "Invalid token", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND_WITH_EMAIL(1005, "Not found with email", HttpStatus.NOT_FOUND),
    EMAIL_EXISTED(1006, "Email already existed", HttpStatus.CONFLICT),
    CHAT_NOT_FOUND(1007, "Chat not found", HttpStatus.NOT_FOUND),
    CANT_REMOVE_USER(1008, "You can't remove another user", HttpStatus.BAD_REQUEST),
    NOT_IN_GROUP(1009, "You are not member of this group", HttpStatus.BAD_REQUEST),
    CANNOT_ADD_USER_TO_SINGLE_CHAT(1010, "You can't add user to single chat", HttpStatus.BAD_REQUEST),
    CANNOT_REMOVE_USER_TO_SINGLE_CHAT(1011, "You can't remove user to single chat", HttpStatus.BAD_REQUEST),
    USER_ALREADY_IN_CHAT(1012, "User already in chat", HttpStatus.BAD_REQUEST),
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
