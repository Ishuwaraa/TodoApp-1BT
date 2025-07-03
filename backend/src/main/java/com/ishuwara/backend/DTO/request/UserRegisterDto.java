package com.ishuwara.backend.DTO.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegisterDto {
    private String name;
    private String email;
    private String password;
}
