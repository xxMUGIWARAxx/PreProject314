package com.buffett.demo.springrest.controller;

import com.buffett.demo.springrest.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@Controller
@RequestMapping("/admin")
@AllArgsConstructor
public class AdminController {
    private final UserService userService;

    @GetMapping
    public String showIndexPage(Model model, Principal principal) {
        model.addAttribute("authUser", userService.getUserByUsername(principal.getName()));
        return "admin";
    }
}
