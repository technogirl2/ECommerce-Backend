package com.codewithangela.ecommerceapi.controller;

import com.codewithangela.ecommerceapi.dto.AuthResponse;
import com.codewithangela.ecommerceapi.model.User;
import com.codewithangela.ecommerceapi.service.JWTService;
import com.codewithangela.ecommerceapi.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;
    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    @GetMapping("users")
    public List<User> getUsers() {
        return userService.getUsers();
    }

    @PostMapping("user-login")
    public AuthResponse login(@RequestBody User user) {
        Authentication auth = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));

        if (auth.isAuthenticated()) {
            return new AuthResponse(jwtService.generateToken(user.getUsername()));
        } else {
            throw new BadCredentialsException("Login failed");
        }

    }

    @PostMapping("user-register")
    public AuthResponse register(@RequestBody User user) {
        String rawPassword = user.getPassword();
        user.setPassword(encoder.encode(rawPassword));
        userService.saveUser(user);
        return new AuthResponse(jwtService.generateToken(user.getUsername()));
    }

}
