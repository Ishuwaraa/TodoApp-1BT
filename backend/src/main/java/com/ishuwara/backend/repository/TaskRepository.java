package com.ishuwara.backend.repository;

import com.ishuwara.backend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByDueDateAndUserEmail(LocalDate dueDate, String email);
    List<Task> findByUserEmail(String email);
    Optional<Task> findByIdAndUserEmail(Long id, String email);
}
