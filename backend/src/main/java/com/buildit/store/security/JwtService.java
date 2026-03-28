package com.buildit.store.security;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;
    private final long tokenTtlSeconds;

    public JwtService(JwtEncoder jwtEncoder,
                      @Value("${security.jwt.ttl-seconds:3600}") long tokenTtlSeconds) {
        this.jwtEncoder = jwtEncoder;
        this.tokenTtlSeconds = tokenTtlSeconds;
    }

    public String createToken(String subject, String role) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("buildit")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(tokenTtlSeconds))
                .subject(subject)
                .claims(existing -> existing.putAll(customClaims(role)))
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(
                org.springframework.security.oauth2.jwt.JwsHeader.with(MacAlgorithm.HS256).build(),
                claims
        )).getTokenValue();
    }

    public long getTokenTtlSeconds() {
        return tokenTtlSeconds;
    }

    private Map<String, Object> customClaims(String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        claims.put("scope", role);
        return claims;
    }
}
