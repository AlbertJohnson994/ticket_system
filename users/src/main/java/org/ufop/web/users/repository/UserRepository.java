package org.ufop.web.users.repository;

import org.ufop.web.users.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUserId(String userId);
    boolean existsByEmail(String email);
    boolean existsByUserId(String userId);
}