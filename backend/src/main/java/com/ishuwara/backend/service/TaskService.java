package com.ishuwara.backend.service;

import com.ishuwara.backend.DTO.request.TaskDto;
import com.ishuwara.backend.model.MyUser;
import com.ishuwara.backend.model.Task;
import com.ishuwara.backend.repository.TaskRepository;
import com.ishuwara.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public List<Task> getAllTasksCreatedByUser() {
        //getting email from the security context set in the jwt filter
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return taskRepository.findByUserEmail(authentication.getName());
    }

    public List<Task> getTasksDueToday() {
        LocalDate today = LocalDate.now();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return taskRepository.findByDueDateAndUserEmail(today, authentication.getName());
    }

    public Task createTask(TaskDto taskDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        MyUser user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Task task = new Task();
        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setDueDate(taskDto.getDueDate());
        task.setUser(user);

        return taskRepository.save(task);
    }

    public Task updateTask(TaskDto taskDto, Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Task task = taskRepository.findByIdAndUserEmail(id, authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setDueDate(taskDto.getDueDate());

        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Task task = taskRepository.findByIdAndUserEmail(id, authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        taskRepository.deleteById(task.getId());
    }
}
