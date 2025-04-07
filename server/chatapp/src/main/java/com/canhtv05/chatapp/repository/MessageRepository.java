package com.canhtv05.chatapp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.canhtv05.chatapp.entity.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, String> {

    @Query("SELECT m FROM Message m JOIN m.chat c WHERE c.id = :chatId")
    Page<Message> findByChatId(@Param("chatId") String chatId, Pageable pageable);

    Long countByChatId(String chatId);
}
