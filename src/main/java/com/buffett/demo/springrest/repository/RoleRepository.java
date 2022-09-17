package com.buffett.demo.springrest.repository;

import com.buffett.demo.springrest.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
}
