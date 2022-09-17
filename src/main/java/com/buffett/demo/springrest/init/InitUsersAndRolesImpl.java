package com.buffett.demo.springrest.init;

import com.buffett.demo.springrest.entity.Role;
import com.buffett.demo.springrest.entity.User;
import com.buffett.demo.springrest.service.UserService;
import com.buffett.demo.springrest.repository.RoleRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;


import javax.annotation.PostConstruct;
import java.util.HashSet;
import java.util.Set;

@Component
@AllArgsConstructor
public class InitUsersAndRolesImpl implements InitUsersAndRoles {
    private final UserService userService;
    private final RoleRepository roleRepository;

    @Override
    @PostConstruct
    public void addStartRoles() {
        roleRepository.save(new Role(1L, "ROLE_ADMIN"));
        roleRepository.save(new Role(2L, "ROLE_USER"));
    }

    @Override
    @PostConstruct
    public void addStartUsers() {
        Set<Role> adminRoles = new HashSet<>();
        adminRoles.add(roleRepository.findById(1L).orElse(null));

        Set<Role> userRoles = new HashSet<>();
        userRoles.add(roleRepository.findById(2L).orElse(null));

        User admin = new User(1L, "admin", "admin", (byte) 44, "admin@mail.ru", "123", adminRoles);
        User user = new User(2L, "user", "user", (byte) 55, "user@mail.ru", "123", userRoles);

        userService.addNewUser(admin);
        userService.addNewUser(user);

        System.out.println("\n\n username - admin@mail.ru : password - 123\n");
        System.out.println("\n username - user@mail.com : password - 123\n");
    }
}
