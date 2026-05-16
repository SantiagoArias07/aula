package mx.aula.backend.service;

import lombok.RequiredArgsConstructor;
import mx.aula.backend.dto.grade.GradeDto;
import mx.aula.backend.dto.submission.CreateSubmissionRequest;
import mx.aula.backend.dto.submission.SubmissionDto;
import mx.aula.backend.entity.*;
import mx.aula.backend.exception.ConflictException;
import mx.aula.backend.exception.ForbiddenException;
import mx.aula.backend.exception.ResourceNotFoundException;
import mx.aula.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final MembershipRepository membershipRepository;
    private final GradeRepository gradeRepository;
    private final StorageService storageService;

    @Transactional
    public SubmissionDto submit(UUID assignmentId, CreateSubmissionRequest req, UUID studentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Tarea no encontrada"));

        if (!assignment.isPublished()) {
            throw new ResourceNotFoundException("Tarea no encontrada");
        }

        UUID grupoId = assignment.getGrupo().getId();
        if (!membershipRepository.existsByStudentIdAndGrupoIdAndActiveTrue(studentId, grupoId)) {
            throw new ForbiddenException("No estás inscrito en este grupo");
        }

        if (submissionRepository.findByAssignmentIdAndStudentId(assignmentId, studentId).isPresent()) {
            throw new ConflictException("Ya entregaste esta tarea. Usa la opción de actualizar entrega.");
        }

        User studentRef = new User();
        studentRef.setId(studentId);

        boolean isLate = assignment.getDueDate() != null
            && OffsetDateTime.now().isAfter(assignment.getDueDate());

        Submission submission = Submission.builder()
            .assignment(assignment)
            .student(studentRef)
            .textBody(req.textBody())
            .status(isLate ? SubmissionStatus.LATE : SubmissionStatus.SUBMITTED)
            .build();

        // Use a proper reference loaded from the repo
        submission = submissionRepository.findById(
            submissionRepository.save(submission).getId()
        ).orElseThrow();

        return SubmissionDto.from(submission);
    }

    @Transactional
    public SubmissionDto attachFile(UUID assignmentId, MultipartFile file, UUID studentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Tarea no encontrada"));

        Submission submission = submissionRepository
            .findByAssignmentIdAndStudentId(assignmentId, studentId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Primero envía tu respuesta de texto antes de adjuntar un archivo"));

        if (!submission.getStudent().getId().equals(studentId)) {
            throw new ForbiddenException("No puedes modificar la entrega de otro alumno");
        }

        String storedPath = storageService.store(file, "submissions/" + assignmentId);
        submission.setFilePath(storedPath);
        submission.setFileName(file.getOriginalFilename());
        submission.setFileSizeBytes(file.getSize());

        return SubmissionDto.from(submissionRepository.save(submission));
    }

    public SubmissionDto getMySubmission(UUID assignmentId, UUID studentId) {
        Submission submission = submissionRepository
            .findByAssignmentIdAndStudentId(assignmentId, studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Aún no has entregado esta tarea"));

        GradeDto gradeDto = gradeRepository.findBySubmissionId(submission.getId())
            .map(GradeDto::from).orElse(null);

        return SubmissionDto.from(submission, gradeDto);
    }

    public List<SubmissionDto> listForAssignment(UUID assignmentId, UUID teacherId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Tarea no encontrada"));

        if (!assignment.getGrupo().getTeacher().getId().equals(teacherId)) {
            throw new ForbiddenException("No eres el docente de esta tarea");
        }

        return submissionRepository.findByAssignmentId(assignmentId).stream()
            .map(s -> {
                GradeDto grade = gradeRepository.findBySubmissionId(s.getId())
                    .map(GradeDto::from).orElse(null);
                return SubmissionDto.from(s, grade);
            })
            .toList();
    }

    public SubmissionDto getOne(UUID submissionId, UUID userId, Role role) {
        Submission submission = submissionRepository.findById(submissionId)
            .orElseThrow(() -> new ResourceNotFoundException("Entrega no encontrada"));

        UUID teacherId = submission.getAssignment().getGrupo().getTeacher().getId();
        UUID ownerId = submission.getStudent().getId();

        if (role == Role.TEACHER && !teacherId.equals(userId)) {
            throw new ForbiddenException("No eres el docente de esta tarea");
        }
        if (role == Role.STUDENT && !ownerId.equals(userId)) {
            throw new ForbiddenException("No puedes ver la entrega de otro alumno");
        }

        GradeDto grade = gradeRepository.findBySubmissionId(submissionId)
            .map(GradeDto::from).orElse(null);
        return SubmissionDto.from(submission, grade);
    }
}
