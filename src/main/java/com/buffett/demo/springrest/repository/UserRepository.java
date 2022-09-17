package com.buffett.demo.springrest.repository;

import com.buffett.demo.springrest.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    @EntityGraph(attributePaths = {"roles"})
    User findUserByUsername(String username);
}
