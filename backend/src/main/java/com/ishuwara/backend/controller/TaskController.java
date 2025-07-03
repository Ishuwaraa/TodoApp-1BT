package com.ishuwara.backend.controller;

import com.ishuwara.backend.DTO.request.TaskDto;
import com.ishuwara.backend.model.Task;
import com.ishuwara.backend.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/")
    public ResponseEntity<List<Task>> getAllTasksCreatedByUser() {
        return new ResponseEntity<>(taskService.getAllTasksCreatedByUser(), HttpStatus.OK);
    }

    @GetMapping("/today")
    public ResponseEntity<List<Task>> getTasksDueToday() {
        return new ResponseEntity<>(taskService.getTasksDueToday(), HttpStatus.OK);
    }

    @PostMapping("/")
    public ResponseEntity<Task> createTask(@RequestBody TaskDto taskDto) {
        return new ResponseEntity<>(taskService.createTask(taskDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@RequestBody TaskDto taskDto, @PathVariable int id) {
        return new ResponseEntity<>(taskService.updateTask(taskDto, (long) id), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable int id) {
        taskService.deleteTask((long) id);
        return new ResponseEntity<>("Task deleted successfully!", HttpStatus.OK);
    }
}
