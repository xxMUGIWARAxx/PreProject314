package com.buffett.demo.springrest.service;

import com.buffett.demo.springrest.entity.User;

import java.util.List;

public interface UserService {

    List<User> getAllUsers();

    User getUserById(Long id);

    User getUserByUsername(String username);

    boolean addNewUser(User user);

    boolean updateUser(User user);

    boolean deleteUserById(Long id);
}