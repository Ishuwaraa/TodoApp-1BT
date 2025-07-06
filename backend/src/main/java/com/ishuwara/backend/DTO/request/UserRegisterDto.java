package com.ishuwara.backend.DTO.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegisterDto {

    @NotBlank(message = "Please provide a name")
    private String name;

    @NotBlank(message = "Please provide an email")
    @Email(message = "Please provide a valid email address")
    private String email;

    @Size(min = 6, message = "Password must be at lest 6 characters long")
    private String password;
}
