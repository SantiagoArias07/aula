package mx.aula.backend.repository;

import mx.aula.backend.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

public interface SubmissionRepository extends JpaRepository<Submission, UUID> {
    Optional<Submission> findByAssignmentIdAndStudentId(UUID assignmentId, UUID studentId);
    List<Submission> findByAssignmentId(UUID assignmentId);
    List<Submission> findByStudentId(UUID studentId);

    @Query("SELECT s.assignment.id FROM Submission s WHERE s.student.id = :studentId AND s.assignment.id IN :assignmentIds")
    Set<UUID> findSubmittedAssignmentIds(@Param("studentId") UUID studentId,
                                         @Param("assignmentIds") List<UUID> assignmentIds);
}
