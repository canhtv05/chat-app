package com.canhtv05.chatapp.exception;

import com.canhtv05.chatapp.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalException {

    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<ApiResponse<?>> handleException(Exception e) {
        ApiResponse<?> apiResponse = ApiResponse.builder()
                .message(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage())
                .code(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode())
                .build();

        return ResponseEntity.badRequest().body(apiResponse);
    }

    

}
