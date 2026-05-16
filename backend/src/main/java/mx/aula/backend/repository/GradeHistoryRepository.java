package mx.aula.backend.repository;

import mx.aula.backend.entity.GradeHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface GradeHistoryRepository extends JpaRepository<GradeHistory, UUID> {
    List<GradeHistory> findByGradeIdOrderByChangedAtDesc(UUID gradeId);
}
