package mx.aula.backend.repository;

import mx.aula.backend.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

public interface GradeRepository extends JpaRepository<Grade, UUID> {
    Optional<Grade> findBySubmissionId(UUID submissionId);
    List<Grade> findByStudentId(UUID studentId);
    List<Grade> findByAssignmentId(UUID assignmentId);

    @Query("SELECT g FROM Grade g WHERE g.student.id = :studentId AND g.assignment.grupo.id = :grupoId")
    List<Grade> findByStudentIdAndGrupoId(@Param("studentId") UUID studentId,
                                          @Param("grupoId") UUID grupoId);

    @Query("SELECT AVG(g.score) FROM Grade g WHERE g.student.id = :studentId AND g.assignment.grupo.id = :grupoId")
    Optional<BigDecimal> findAverageScoreByStudentAndGrupo(@Param("studentId") UUID studentId,
                                                            @Param("grupoId") UUID grupoId);

    @Query("SELECT g.submission.id, g FROM Grade g WHERE g.submission.id IN :submissionIds")
    List<Object[]> findBySubmissionIds(@Param("submissionIds") List<UUID> submissionIds);
}
