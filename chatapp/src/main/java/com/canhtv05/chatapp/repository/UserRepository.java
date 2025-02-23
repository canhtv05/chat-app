package com.canhtv05.chatapp.repository;

import com.canhtv05.chatapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    User findByEmail(String email);

    @Query(value = "SELECT u FROM User u WHERE u.full_name LIKE %?1% OR u.email LIKE %?1%")
    List<User> searchUserByFullNameOrEmail(String query);
}
