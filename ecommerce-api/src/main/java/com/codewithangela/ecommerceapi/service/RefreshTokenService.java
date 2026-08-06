package com.codewithangela.ecommerceapi.service;


import com.codewithangela.ecommerceapi.dao.RefreshTokenRepo;
import com.codewithangela.ecommerceapi.dao.UserRepo;
import com.codewithangela.ecommerceapi.model.RefreshToken;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class RefreshTokenService {
    @Value("${jwt.refreshExpirationMs}")
    private Long refreshTokenDurationMs;

    private final RefreshTokenRepo refreshTokenRepository;
    private final UserRepo userRepository;

    public RefreshTokenService(RefreshTokenRepo repo, UserRepo userRepo) {
        this.refreshTokenRepository = repo;
        this.userRepository = userRepo;
    }

    public RefreshToken createRefreshToken(Integer userId) {
        refreshTokenRepository.findByUser_Id(userId).ifPresent(refreshTokenRepository::delete);

        var token = new RefreshToken();
        token.setUser(userRepository.findById(userId).get());
        token.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        token.setToken(UUID.randomUUID().toString());
        return refreshTokenRepository.save(token);
    }

    public boolean isTokenExpired(RefreshToken token) {
        return token.getExpiryDate().isBefore(Instant.now());
    }
}
