package com.canhtv05.chatapp.exception;

import com.canhtv05.chatapp.dto.ApiResponse;
import jakarta.validation.ConstraintViolation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<ApiResponse<?>> handleException(Exception e) {
        ApiResponse<?> apiResponse = ApiResponse.builder()
                .message(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage())
                .code(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode())
                .build();

        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(value = AppException.class)
    public ResponseEntity<ApiResponse<?>> handleAppException(AppException e) {
        ErrorCode errorCode = e.getErrorCode();
        ApiResponse<?> apiResponse = ApiResponse.builder()
                .message(errorCode.getMessage())
                .code(errorCode.getCode())
                .build();

        return ResponseEntity.status(errorCode.getCode()).body(apiResponse);
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<?>> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        String enumKey = e.getFieldError() != null ? e.getFieldError().getDefaultMessage() : "INVALID_KEY";

        ErrorCode errorCode = ErrorCode.INVALID_KEY;
        Map<String, Object> attributes = new HashMap<>();

        try {
            errorCode = ErrorCode.valueOf(enumKey);

            var allErrors = e.getBindingResult().getAllErrors();
            ConstraintViolation<?> constraintViolation = null;

            if (!allErrors.isEmpty()) {
                constraintViolation = allErrors.get(0).unwrap(ConstraintViolation.class);
            }

            if (constraintViolation != null) {
                attributes = constraintViolation.getConstraintDescriptor().getAttributes();
            }
        } catch (IllegalArgumentException ex) {
            log.debug("Invalid enum key: {}", enumKey);
        }

        ApiResponse<?> apiResponse = new ApiResponse<>();

        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(
                Objects.nonNull(attributes)
                        ? mapAttribute(errorCode.getMessage(), attributes)
                        : errorCode.getMessage());

        return ResponseEntity.badRequest().body(apiResponse);
    }

    private String mapAttribute(String message, Map<String, Object> attributes) {
        String result = message;
        for (Map.Entry<String, Object> entry : attributes.entrySet()) {
            result = result.replace("{" + entry.getKey() + "}", String.valueOf(entry.getValue()));
        }
        return result;
    }

}
