package com.canhtv05.chatapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.canhtv05.chatapp.entity.Chat;
import com.canhtv05.chatapp.entity.User;

@Repository
public interface ChatRepository extends JpaRepository<Chat, String> {

    @Query(
            "SELECT c FROM Chat c JOIN c.users u1 JOIN c.users u2 WHERE c.isGroup = false AND u1 = :user AND u2 = :requestUser")
    Chat findSingleChatByUserIds(@Param("user") User user, @Param("requestUser") User requestUser);

    @Query("SELECT c FROM Chat c JOIN c.users u JOIN c.messages m WHERE u.id = :userId ORDER BY m.timestamp DESC ")
    List<Chat> findChatByUserId(@Param("userId") String userId);
}
