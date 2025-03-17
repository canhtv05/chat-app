package com.canhtv05.chatapp.service;

import com.canhtv05.chatapp.entity.InvalidateToken;

public interface InvalidateTokenService {

    boolean existsById(String id);

    void save(InvalidateToken invalidateToken);
}
