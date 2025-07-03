package com.ishuwara.backend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Service
public class JWTService {

    @Value("${jwt.access.secret}")
    private String accessTokenSecret;

    private long accessTokenExpiration = 1000 * 60 * 60; //1h

    public String generateAccessToken(UserDetails userDetails, Map<String, Object> extraClaims) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
                .signWith(generateKey(accessTokenSecret))
                .compact();
    }

    //to extract user email
    public String extractUsername(String token) {
        return extractClaim(token, accessTokenSecret, Claims::getSubject);
    }

    public UserDetails extractUserDetails(String token) {
        Claims claims = extractAllClaims(token, accessTokenSecret);

        return new User(claims.getSubject(), "", List.of());
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    public <T> T extractClaim(String token, String secret, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token, secret);
        return claimsResolver.apply(claims);
    }

    public Claims extractAllClaims(String token, String secret) {
        try {
            return Jwts.parser()
                    .verifyWith(generateKey(secret)).build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "jwt expired");
        } catch (SignatureException e) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "invalid token");
        } catch (JwtException e) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "error validating token: " + e.getMessage());
        }
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token, accessTokenSecret).before(new Date());
    }
    private Date extractExpiration(String token, String secret) {
        return extractClaim(token, secret, Claims::getExpiration);
    }
    private SecretKey generateKey(String secret) {
        byte[] keyBytes = Base64.getDecoder().decode(secret);
        return new SecretKeySpec(keyBytes, "HmacSHA256");
    }
}
