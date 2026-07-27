package com.codewithangela.ecommerceapi.controller;

import com.codewithangela.ecommerceapi.model.User;
import com.codewithangela.ecommerceapi.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class UserController {
    @Autowired
    private UserService userService;
    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    @GetMapping("users")
    public List<User> getUsers() {
        return userService.getUsers();
    }

    @PostMapping("user-register")
    public User register(@RequestBody User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        System.out.println(user);
        userService.saveUser(user);
        return user;
    }

}
