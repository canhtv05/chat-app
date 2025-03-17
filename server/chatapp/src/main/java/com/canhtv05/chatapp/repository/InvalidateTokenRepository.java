package com.canhtv05.chatapp.repository;

import com.canhtv05.chatapp.entity.InvalidateToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvalidateTokenRepository extends JpaRepository<InvalidateToken, String> {
}
