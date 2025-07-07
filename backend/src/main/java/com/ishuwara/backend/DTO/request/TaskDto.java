package com.ishuwara.backend.DTO.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class TaskDto {

    @NotBlank(message = "Please provide the task title")
    private String title;

    @Size(max = 1000, message = "Description must be at most 1000 charaters")
    private String description;

    @NotNull(message = "Please provide the task due date")
    //@FutureOrPresent(message = "Due date must be today or in the future")
    private LocalDate dueDate;
    private LocalTime dueTime;
}
