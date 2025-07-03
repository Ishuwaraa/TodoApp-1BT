package com.ishuwara.backend.DTO.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TaskDto {
    private String title;
    private String description;
    private LocalDate dueDate;
}
