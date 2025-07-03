package com.ishuwara.backend.repository;

import com.ishuwara.backend.model.MyUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<MyUser, UUID> {
    Optional<MyUser> findByEmail(String email);
}
