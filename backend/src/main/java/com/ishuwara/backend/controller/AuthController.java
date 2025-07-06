package com.ishuwara.backend.controller;

import com.ishuwara.backend.DTO.request.ForgotPasswordDto;
import com.ishuwara.backend.DTO.request.ResetPasswordDto;
import com.ishuwara.backend.DTO.request.UserLoginDto;
import com.ishuwara.backend.DTO.request.UserRegisterDto;
import com.ishuwara.backend.DTO.response.UserLoginResponseDto;
import com.ishuwara.backend.DTO.response.UserRegisterResponseDto;
import com.ishuwara.backend.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationService authService;

    public AuthController(AuthenticationService authenticationService) {
        this.authService = authenticationService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserRegisterResponseDto> register(@RequestBody @Valid UserRegisterDto dto) {
        UserRegisterResponseDto res = authService.register(dto);
        if (res.getError() != null && res.getEmail() == null) {
            return new ResponseEntity<>(res, HttpStatus.INTERNAL_SERVER_ERROR);
        } else if (res.getError() != null) {
            //409 for existing users
            return new ResponseEntity<>(res, HttpStatus.CONFLICT);
        }

        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<UserLoginResponseDto> login(@RequestBody @Valid UserLoginDto dto) {
        UserLoginResponseDto res = authService.login(dto);
        if (res.getError() != null) {
            return new ResponseEntity<>(res, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(new UserLoginResponseDto(res.getAccessToken(), null), HttpStatus.OK);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody @Valid ForgotPasswordDto dto) {
        if (!authService.forgotPassword(dto)) {
            return new ResponseEntity<>("Email not found", HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>("Password reset link sent to your email", HttpStatus.OK);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody @Valid ResetPasswordDto dto) {
        authService.resetPassword(dto);
        return new ResponseEntity<>("Password reset successfully", HttpStatus.OK);
    }
}
