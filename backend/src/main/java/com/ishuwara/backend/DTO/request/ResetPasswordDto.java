package com.ishuwara.backend.DTO.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordDto {
    private String password;
    private String token;
}
