package mx.aula.backend.service;

import lombok.RequiredArgsConstructor;
import mx.aula.backend.dto.grade.GradeDto;
import mx.aula.backend.dto.grade.GradeRequest;
import mx.aula.backend.entity.*;
import mx.aula.backend.exception.ForbiddenException;
import mx.aula.backend.exception.ResourceNotFoundException;
import mx.aula.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GradeService {

    private final GradeRepository gradeRepository;
    private final GradeHistoryRepository gradeHistoryRepository;
    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;

    @Transactional
    public GradeDto grade(UUID submissionId, GradeRequest req, UUID graderId) {
        Submission submission = submissionRepository.findById(submissionId)
            .orElseThrow(() -> new ResourceNotFoundException("Entrega no encontrada"));

        assertTeacherOwnsSubmission(submission, graderId);

        if (req.score().compareTo(submission.getAssignment().getMaxPoints()) > 0) {
            throw new IllegalArgumentException(
                "La calificación no puede superar el puntaje máximo de "
                    + submission.getAssignment().getMaxPoints());
        }

        if (gradeRepository.findBySubmissionId(submissionId).isPresent()) {
            throw new ForbiddenException(
                "Esta entrega ya fue calificada. Usa PUT para actualizar la calificación.");
        }

        User grader = userRepository.getReferenceById(graderId);

        Grade grade = Grade.builder()
            .submission(submission)
            .assignment(submission.getAssignment())
            .student(submission.getStudent())
            .grader(grader)
            .score(req.score())
            .feedback(req.feedback())
            .build();

        Grade saved = gradeRepository.save(grade);

        submission.setStatus(SubmissionStatus.GRADED);
        submissionRepository.save(submission);

        return GradeDto.from(gradeRepository.findById(saved.getId()).orElseThrow());
    }

    @Transactional
    public GradeDto updateGrade(UUID submissionId, GradeRequest req, UUID graderId) {
        Submission submission = submissionRepository.findById(submissionId)
            .orElseThrow(() -> new ResourceNotFoundException("Entrega no encontrada"));

        assertTeacherOwnsSubmission(submission, graderId);

        Grade grade = gradeRepository.findBySubmissionId(submissionId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Esta entrega aún no ha sido calificada. Usa POST primero."));

        User changedBy = userRepository.getReferenceById(graderId);

        GradeHistory history = GradeHistory.builder()
            .grade(grade)
            .oldScore(grade.getScore())
            .newScore(req.score())
            .oldFeedback(grade.getFeedback())
            .newFeedback(req.feedback())
            .changedBy(changedBy)
            .build();
        gradeHistoryRepository.save(history);

        grade.setScore(req.score());
        grade.setFeedback(req.feedback());
        return GradeDto.from(gradeRepository.save(grade));
    }

    public GradeDto getGrade(UUID submissionId, UUID userId, Role role) {
        Submission submission = submissionRepository.findById(submissionId)
            .orElseThrow(() -> new ResourceNotFoundException("Entrega no encontrada"));

        if (role == Role.STUDENT && !submission.getStudent().getId().equals(userId)) {
            throw new ForbiddenException("No puedes ver la calificación de otro alumno");
        }
        if (role == Role.TEACHER) {
            assertTeacherOwnsSubmission(submission, userId);
        }

        return gradeRepository.findBySubmissionId(submissionId)
            .map(GradeDto::from)
            .orElseThrow(() -> new ResourceNotFoundException("Esta entrega aún no tiene calificación"));
    }

    public List<GradeDto> listGradesForStudent(UUID grupoId, UUID studentId) {
        return gradeRepository.findByStudentIdAndGrupoId(studentId, grupoId)
            .stream().map(GradeDto::from).toList();
    }

    private void assertTeacherOwnsSubmission(Submission submission, UUID teacherId) {
        if (!submission.getAssignment().getGrupo().getTeacher().getId().equals(teacherId)) {
            throw new ForbiddenException("No eres el docente de esta tarea");
        }
    }
}
