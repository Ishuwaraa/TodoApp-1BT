package com.ishuwara.backend.controller;

import com.ishuwara.backend.DTO.request.PasswordUpdateDto;
import com.ishuwara.backend.DTO.response.UserResponseDto;
import com.ishuwara.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/")
    public ResponseEntity<UserResponseDto> getUserDetails() {
        return new ResponseEntity<>(userService.getUserDetails(), HttpStatus.OK);
    }

    @PutMapping("/change-password")
    public ResponseEntity<String> updateUserPassword(@RequestBody PasswordUpdateDto dto) {
        if (dto.getNewPassword() == null || dto.getCurrentPassword() == null || dto.getNewPassword().isEmpty()) {
            return new ResponseEntity<>("Values can not be empty", HttpStatus.BAD_REQUEST);
        }

        String res = userService.updateUserPassword(dto);
        if (res == null) {
            return new ResponseEntity<>("Invalid password", HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(res, HttpStatus.OK);
    }
}
