package com.ishuwara.backend.service;

import com.ishuwara.backend.DTO.request.TaskDto;
import com.ishuwara.backend.model.Task;
import com.ishuwara.backend.repository.TaskRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
public class TaskService {
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getAllTasksCreatedByUser() {
        return taskRepository.findAll();
    }

    public List<Task> getTasksDueToday() {
        LocalDate today = LocalDate.now();
        System.out.println(today);
        return taskRepository.findByDueDate(today);
    }

    public Task createTask(TaskDto taskDto) {
        Task task = new Task();
        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setDueDate(taskDto.getDueDate());

        return taskRepository.save(task);
    }

    public Task updateTask(TaskDto taskDto, Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setDueDate(taskDto.getDueDate());

        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        taskRepository.deleteById(task.getId());
    }
}
