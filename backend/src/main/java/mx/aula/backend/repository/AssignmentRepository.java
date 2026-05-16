package mx.aula.backend.repository;

import mx.aula.backend.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AssignmentRepository extends JpaRepository<Assignment, UUID> {
    List<Assignment> findByGrupoIdOrderByCreatedAtDesc(UUID grupoId);
    List<Assignment> findByGrupoIdAndPublishedTrueOrderByDueDateAsc(UUID grupoId);
    List<Assignment> findByGrupoIdIn(List<UUID> grupoIds);
    List<Assignment> findByGrupoIdInAndPublishedTrue(List<UUID> grupoIds);
}
