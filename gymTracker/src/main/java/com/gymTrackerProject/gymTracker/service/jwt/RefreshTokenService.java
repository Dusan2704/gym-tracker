package com.gymTrackerProject.gymTracker.service.jwt;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
@Service
public class RefreshTokenService {
    private Map<String, String> refreshTokenStore = new HashMap<>(); // username -> refresh token

    // proveri da li je refresh token validan
    public boolean isValid(String token) {
        return refreshTokenStore.containsValue(token);
    }

    // vrati username iz refresh tokena
    public String getUsernameFromRefreshToken(String token) {
        return refreshTokenStore.entrySet()
                .stream()
                .filter(entry -> entry.getValue().equals(token))
                .map(Map.Entry::getKey)
                .findFirst()
                .orElse(null);
    }

    // napravi novi refresh token za username
    public String createRefreshToken(String username) {
        String token = UUID.randomUUID().toString();
        refreshTokenStore.put(username, token);
        return token;
    }
}

