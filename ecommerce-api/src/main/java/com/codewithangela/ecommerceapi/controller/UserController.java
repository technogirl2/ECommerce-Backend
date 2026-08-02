package com.codewithangela.ecommerceapi.controller;

import com.codewithangela.ecommerceapi.constants.Role;
import com.codewithangela.ecommerceapi.dao.RefreshTokenRepo;
import com.codewithangela.ecommerceapi.dto.AuthResponse;
import com.codewithangela.ecommerceapi.dto.RefreshTokenRequest;
import com.codewithangela.ecommerceapi.model.User;
import com.codewithangela.ecommerceapi.service.JWTService;
import com.codewithangela.ecommerceapi.service.RefreshTokenService;
import com.codewithangela.ecommerceapi.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private RefreshTokenRepo refreshTokenRepository;

    @Autowired
    private RefreshTokenService refreshTokenService;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    @GetMapping("users")
    public List<User> getUsers() {
        return userService.getUsers();
    }

    @PostMapping("user-login")
    public ResponseEntity<AuthResponse> login(@RequestBody User user) {
        // authenticate() throws BadCredentialsException on failure, so reaching
        // this line means auth succeeded
        authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));

        User authenticatedUser = userService.getUserByUsername(user.getUsername());
        String accessToken = jwtService.generateToken(authenticatedUser.getUsername());
        String refreshToken = refreshTokenService.createRefreshToken(authenticatedUser.getId()).getToken();

        return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken));
    }

    @PostMapping("user-register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userService.getUserByUsername(user.getUsername()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Username already exists."));
        }

        String rawPassword = user.getPassword();
        user.setPassword(encoder.encode(rawPassword));
        user.setRole(Role.USER); // never trust a client-supplied role on self-registration
        User savedUser = userService.saveUser(user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("username", savedUser.getUsername()));
    }

    @PostMapping("/user-refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest request) {
        String requestToken = request.refreshToken();
        return refreshTokenRepository.findByToken(requestToken)
                .map(token -> {
                    if (refreshTokenService.isTokenExpired(token)) {
                        refreshTokenRepository.delete(token);
                        return ResponseEntity.badRequest()
                                .body(Map.of("error", "Refresh token expired. Please login again."));
                    }
                    String newJwt = jwtService.generateToken(token.getUser().getUsername());
                    return ResponseEntity.ok(Map.of("token", newJwt));
                })
                .orElse(ResponseEntity.badRequest().body(Map.of("error", "Invalid refresh token.")));
    }

    @PostMapping("/user-logout")
    public ResponseEntity<?> logoutUser(@RequestBody Map<String, String> payload) {
        String requestToken = payload.get("refreshToken");

        if (requestToken == null || requestToken.isBlank()) {
            return ResponseEntity.badRequest().body("Refresh token is required.");
        }

        return refreshTokenRepository.findByToken(requestToken)
                .map(token -> {
                    refreshTokenRepository.delete(token);
                    return ResponseEntity.ok("Logged out successfully.");
                })
                .orElse(ResponseEntity.badRequest().body("Invalid refresh token."));
    }
}
