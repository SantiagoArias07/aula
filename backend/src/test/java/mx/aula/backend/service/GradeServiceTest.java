package mx.aula.backend.service;

import mx.aula.backend.dto.grade.GradeDto;
import mx.aula.backend.dto.grade.GradeRequest;
import mx.aula.backend.entity.*;
import mx.aula.backend.exception.ForbiddenException;
import mx.aula.backend.exception.ResourceNotFoundException;
import mx.aula.backend.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GradeServiceTest {

    @Mock GradeRepository gradeRepository;
    @Mock GradeHistoryRepository gradeHistoryRepository;
    @Mock SubmissionRepository submissionRepository;
    @Mock UserRepository userRepository;
    @InjectMocks GradeService gradeService;

    private final UUID teacherId = UUID.randomUUID();
    private final UUID studentId = UUID.randomUUID();
    private final UUID submissionId = UUID.randomUUID();
    private final UUID assignmentId = UUID.randomUUID();
    private final UUID grupoId = UUID.randomUUID();

    private User teacher;
    private User student;
    private Grupo grupo;
    private Assignment assignment;
    private Submission submission;

    @BeforeEach
    void setUp() {
        teacher = User.builder().id(teacherId).role(Role.TEACHER)
            .firstName("Ana").lastName("López").build();
        student = User.builder().id(studentId).role(Role.STUDENT)
            .firstName("Carlos").lastName("Pérez").build();
        grupo = Grupo.builder().id(grupoId).name("3°A").subject("Matemáticas")
            .teacher(teacher).build();
        assignment = Assignment.builder().id(assignmentId).grupo(grupo)
            .title("Examen 1").maxPoints(BigDecimal.valueOf(100)).build();
        submission = Submission.builder().id(submissionId).assignment(assignment)
            .student(student).status(SubmissionStatus.SUBMITTED).build();
    }

    @Test
    void grade_withValidData_createsGrade() {
        when(submissionRepository.findById(submissionId)).thenReturn(Optional.of(submission));
        when(gradeRepository.findBySubmissionId(submissionId)).thenReturn(Optional.empty());
        when(userRepository.getReferenceById(teacherId)).thenReturn(teacher);

        Grade savedGrade = Grade.builder()
            .id(UUID.randomUUID()).submission(submission).assignment(assignment)
            .student(student).grader(teacher).score(BigDecimal.valueOf(85))
            .build();
        when(gradeRepository.save(any())).thenReturn(savedGrade);
        when(gradeRepository.findById(savedGrade.getId())).thenReturn(Optional.of(savedGrade));

        GradeDto result = gradeService.grade(submissionId,
            new GradeRequest(BigDecimal.valueOf(85), "Buen trabajo"), teacherId);

        assertThat(result.score()).isEqualByComparingTo(BigDecimal.valueOf(85));
        verify(submissionRepository).save(argThat(s -> s.getStatus() == SubmissionStatus.GRADED));
    }

    @Test
    void grade_byNonOwnerTeacher_throwsForbidden() {
        when(submissionRepository.findById(submissionId)).thenReturn(Optional.of(submission));

        UUID otherTeacher = UUID.randomUUID();
        assertThatThrownBy(() -> gradeService.grade(submissionId,
            new GradeRequest(BigDecimal.valueOf(70), null), otherTeacher))
            .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void grade_withScoreAboveMax_throwsIllegalArgument() {
        when(submissionRepository.findById(submissionId)).thenReturn(Optional.of(submission));
        // score check happens before DB lookup — no gradeRepository stub needed

        assertThatThrownBy(() -> gradeService.grade(submissionId,
            new GradeRequest(BigDecimal.valueOf(150), null), teacherId))
            .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void getGrade_forUnknownSubmission_throwsNotFound() {
        when(submissionRepository.findById(any())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> gradeService.getGrade(UUID.randomUUID(), teacherId, Role.TEACHER))
            .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void getGrade_studentViewingOtherStudentGrade_throwsForbidden() {
        when(submissionRepository.findById(submissionId)).thenReturn(Optional.of(submission));

        UUID otherStudent = UUID.randomUUID();
        assertThatThrownBy(() -> gradeService.getGrade(submissionId, otherStudent, Role.STUDENT))
            .isInstanceOf(ForbiddenException.class);
    }
}
