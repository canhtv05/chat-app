package com.canhtv05.chatapp.repository;

import com.canhtv05.chatapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);

    @Query(value = "SELECT u FROM User u WHERE u.last_name LIKE %?1% OR u.first_name LIKE %?1% OR u.email LIKE %?1%")
    List<User> searchUserByFullNameOrEmail(String query);

    boolean existsByEmail(String email);
}
