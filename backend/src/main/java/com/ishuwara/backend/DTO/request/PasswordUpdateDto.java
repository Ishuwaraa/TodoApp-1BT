package com.ishuwara.backend.DTO.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordUpdateDto {

    @Size(min = 6, message = "Password must be at lest 6 characters long")
    private String currentPassword;

    @Size(min = 6, message = "Password must be at lest 6 characters long")
    private String newPassword;
}
