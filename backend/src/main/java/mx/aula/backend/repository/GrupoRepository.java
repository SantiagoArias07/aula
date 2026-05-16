package mx.aula.backend.repository;

import mx.aula.backend.entity.Grupo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface GrupoRepository extends JpaRepository<Grupo, UUID> {

    List<Grupo> findByTeacherIdAndActiveTrue(UUID teacherId);

    @Query("""
        SELECT g FROM Grupo g
        JOIN g.memberships m
        WHERE m.student.id = :studentId
        AND m.active = true
        AND g.active = true
        """)
    List<Grupo> findByStudentId(@Param("studentId") UUID studentId);
}
