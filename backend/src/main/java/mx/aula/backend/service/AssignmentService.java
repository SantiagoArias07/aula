package mx.aula.backend.service;

import lombok.RequiredArgsConstructor;
import mx.aula.backend.dto.assignment.AssignmentDto;
import mx.aula.backend.dto.assignment.CreateAssignmentRequest;
import mx.aula.backend.entity.Assignment;
import mx.aula.backend.entity.Grupo;
import mx.aula.backend.entity.Role;
import mx.aula.backend.entity.SubmissionStatus;
import mx.aula.backend.exception.ForbiddenException;
import mx.aula.backend.exception.ResourceNotFoundException;
import mx.aula.backend.repository.AssignmentRepository;
import mx.aula.backend.repository.GrupoRepository;
import mx.aula.backend.repository.MembershipRepository;
import mx.aula.backend.repository.SubmissionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final GrupoRepository grupoRepository;
    private final MembershipRepository membershipRepository;
    private final SubmissionRepository submissionRepository;

    @Transactional
    public AssignmentDto create(UUID grupoId, CreateAssignmentRequest req, UUID teacherId) {
        Grupo grupo = grupoRepository.findById(grupoId)
            .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado"));

        if (!grupo.getTeacher().getId().equals(teacherId)) {
            throw new ForbiddenException("No eres el docente de este grupo");
        }

        Assignment assignment = Assignment.builder()
            .grupo(grupo)
            .title(req.title())
            .description(req.description())
            .dueDate(req.dueDate())
            .maxPoints(req.maxPoints())
            .submissionType(req.submissionType())
            .published(req.published())
            .build();

        return AssignmentDto.from(assignmentRepository.save(assignment));
    }

    public List<AssignmentDto> listForGrupo(UUID grupoId, UUID userId, Role role) {
        Grupo grupo = grupoRepository.findById(grupoId)
            .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado"));

        if (role == Role.TEACHER) {
            if (!grupo.getTeacher().getId().equals(userId)) {
                throw new ForbiddenException("No eres el docente de este grupo");
            }
            return assignmentRepository.findByGrupoIdOrderByCreatedAtDesc(grupoId)
                .stream().map(AssignmentDto::from).toList();
        }

        // Student — only published, annotate with submission status
        if (!membershipRepository.existsByStudentIdAndGrupoIdAndActiveTrue(userId, grupoId)) {
            throw new ForbiddenException("No estás inscrito en este grupo");
        }
        List<Assignment> assignments = assignmentRepository
            .findByGrupoIdAndPublishedTrueOrderByDueDateAsc(grupoId);
        Set<UUID> submitted = submissionRepository.findSubmittedAssignmentIds(
            userId, assignments.stream().map(Assignment::getId).toList());

        return assignments.stream()
            .map(a -> AssignmentDto.from(a,
                submitted.contains(a.getId()) ? SubmissionStatus.SUBMITTED : null))
            .toList();
    }

    public AssignmentDto getOne(UUID assignmentId, UUID userId, Role role) {
        Assignment a = assignmentRepository.findById(assignmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Tarea no encontrada"));

        UUID grupoId = a.getGrupo().getId();
        if (role == Role.TEACHER && !a.getGrupo().getTeacher().getId().equals(userId)) {
            throw new ForbiddenException("No eres el docente de este grupo");
        }
        if (role == Role.STUDENT) {
            if (!a.isPublished()) throw new ResourceNotFoundException("Tarea no encontrada");
            if (!membershipRepository.existsByStudentIdAndGrupoIdAndActiveTrue(userId, grupoId)) {
                throw new ForbiddenException("No estás inscrito en este grupo");
            }
            boolean submitted = submissionRepository
                .findByAssignmentIdAndStudentId(assignmentId, userId).isPresent();
            return AssignmentDto.from(a, submitted ? SubmissionStatus.SUBMITTED : null);
        }
        return AssignmentDto.from(a);
    }

    @Transactional
    public void delete(UUID assignmentId, UUID teacherId) {
        Assignment a = assignmentRepository.findById(assignmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Tarea no encontrada"));
        if (!a.getGrupo().getTeacher().getId().equals(teacherId)) {
            throw new ForbiddenException("No eres el docente de este grupo");
        }
        assignmentRepository.delete(a);
    }

    @Transactional
    public AssignmentDto update(UUID assignmentId, CreateAssignmentRequest req, UUID teacherId) {
        Assignment a = assignmentRepository.findById(assignmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Tarea no encontrada"));
        if (!a.getGrupo().getTeacher().getId().equals(teacherId)) {
            throw new ForbiddenException("No eres el docente de este grupo");
        }
        a.setTitle(req.title());
        a.setDescription(req.description());
        a.setDueDate(req.dueDate());
        a.setMaxPoints(req.maxPoints());
        a.setSubmissionType(req.submissionType());
        a.setPublished(req.published());
        return AssignmentDto.from(assignmentRepository.save(a));
    }
}
