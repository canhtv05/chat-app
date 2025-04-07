package com.canhtv05.chatapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.canhtv05.chatapp.entity.InvalidateToken;

public interface InvalidateTokenRepository extends JpaRepository<InvalidateToken, String> {}
