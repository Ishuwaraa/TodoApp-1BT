package com.ishuwara.backend.service;

import com.ishuwara.backend.DTO.request.ForgotPasswordDto;
import com.ishuwara.backend.DTO.request.ResetPasswordDto;
import com.ishuwara.backend.DTO.request.UserLoginDto;
import com.ishuwara.backend.DTO.request.UserRegisterDto;
import com.ishuwara.backend.DTO.response.UserLoginResponseDto;
import com.ishuwara.backend.DTO.response.UserRegisterResponseDto;
import com.ishuwara.backend.model.MyUser;
import com.ishuwara.backend.repository.UserRepository;
import jakarta.mail.MessagingException;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final MailService mailService;

    public AuthenticationService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JWTService jwtService, MailService mailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }

    public UserRegisterResponseDto register(UserRegisterDto dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            return new UserRegisterResponseDto(dto.getEmail(), "email already exists");
        }

        MyUser user = new MyUser();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        userRepository.save(user);
        if (user.getId() == null) {
            return new UserRegisterResponseDto(null, "error creating the user");
        }

        return new UserRegisterResponseDto(user.getEmail(), null);
    }

    public UserLoginResponseDto login(UserLoginDto dto) {
        Map<String, Object> claims = new HashMap<>();

        try {
            //authenticating the user
            //this is internally calling the loadUserByUsername func in MyUserDetailsService
            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword()));

            //fetching again cuz need user id as a claim in the token.
            MyUser user = userRepository.findByEmail(dto.getEmail())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found"));

            claims.put("id", user.getId());

            String accessToken = jwtService.generateAccessToken(user, claims);

            return new UserLoginResponseDto(accessToken, null);
        } catch (UsernameNotFoundException | BadCredentialsException e) {
            //multi catch to if user exists or invalid credentials
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        } catch (AuthenticationException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    public boolean forgotPassword(ForgotPasswordDto dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            try {
                String resetPassToken = jwtService.generateResetPassToken(dto.getEmail());

                String html = String.format("""
                    <h1>Reset Your Password</h1>
                    <p>Click on the following link to reset your password:</p>
                    <a href="http://localhost:3000/reset-password?token=%s">http://localhost:3000/reset-password</a>
                    <p>This link will expire in 10 minutes.</p>
                    <p>If you didn't request a password reset, please ignore this email.</p>
                """, resetPassToken);

                mailService.sendHtml(dto.getEmail(), "Change Password", html);
                return true;
            } catch (MessagingException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
            }
        }

        return false;
    }

    public void resetPassword(ResetPasswordDto dto) {
        String email = jwtService.validateResetPassToken(dto.getToken());

        MyUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        userRepository.save(user);
    }
}
