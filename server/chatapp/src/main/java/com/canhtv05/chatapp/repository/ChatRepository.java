package com.canhtv05.chatapp.repository;

import com.canhtv05.chatapp.entity.Chat;
import com.canhtv05.chatapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<Chat, String> {

    @Query("SELECT c FROM Chat c WHERE c.isGroup = false AND :user MEMBER OF c.users AND :requestUser MEMBER OF c" +
            ".users")
    Chat findSingleChatByUserIds(@Param("user") User user, @Param("requestUser") User requestUser);

    @Query("SELECT c FROM Chat c JOIN c.users u WHERE u.id = :userId")
    List<Chat> findChatByUserId(@Param("userId") String userId);
}
