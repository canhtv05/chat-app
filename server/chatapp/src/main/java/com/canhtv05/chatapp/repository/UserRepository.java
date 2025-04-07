package com.canhtv05.chatapp.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.canhtv05.chatapp.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);

    @Query("SELECT DISTINCT u FROM User u WHERE "
            + "(LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(CONCAT('%', :query, '%')) "
            + "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))) "
            + "AND u.id != :currentUserId "
            + "AND u.userStatus = 'ACTIVE'")
    Page<User> searchUserByFullNameOrEmailExcludingCurrentUser(
            @Param("query") String query, @Param("currentUserId") String currentUserId, Pageable pageable);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);
}
