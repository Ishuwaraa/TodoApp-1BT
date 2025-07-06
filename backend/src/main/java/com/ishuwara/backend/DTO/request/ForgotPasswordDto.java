package com.ishuwara.backend.DTO.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ForgotPasswordDto {

    @NotBlank(message = "Please provide an email")
    @Email(message = "Please provide a valid email address")
    private String email;
}
