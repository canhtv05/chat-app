package com.canhtv05.chatapp.service.impl;

import org.springframework.stereotype.Service;

import com.canhtv05.chatapp.entity.InvalidateToken;
import com.canhtv05.chatapp.repository.InvalidateTokenRepository;
import com.canhtv05.chatapp.service.InvalidateTokenService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InvalidateTokenImplementation implements InvalidateTokenService {

    InvalidateTokenRepository invalidateTokenRepository;

    @Override
    public boolean existsById(String id) {
        return invalidateTokenRepository.existsById(id);
    }

    @Override
    public void save(InvalidateToken invalidateToken) {
        invalidateTokenRepository.save(invalidateToken);
    }
}
