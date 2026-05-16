package mx.aula.backend.service;

import lombok.RequiredArgsConstructor;
import mx.aula.backend.dto.assignment.AssignmentDto;
import mx.aula.backend.dto.dashboard.StudentDashboardDto;
import mx.aula.backend.dto.grupo.GrupoSummaryDto;
import mx.aula.backend.entity.Assignment;
import mx.aula.backend.entity.Grupo;
import mx.aula.backend.entity.SubmissionStatus;
import mx.aula.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final GrupoRepository grupoRepository;
    private final AssignmentRepository assignmentRepository;
    private final SubmissionRepository submissionRepository;
    private final GradeRepository gradeRepository;
    private final MembershipRepository membershipRepository;

    public StudentDashboardDto getStudentDashboard(UUID studentId) {
        List<Grupo> grupos = grupoRepository.findByStudentId(studentId);
        List<UUID> grupoIds = grupos.stream().map(Grupo::getId).toList();

        List<Assignment> allPublished = grupoIds.isEmpty()
            ? List.of()
            : assignmentRepository.findByGrupoIdInAndPublishedTrue(grupoIds);

        List<UUID> assignmentIds = allPublished.stream().map(Assignment::getId).toList();
        Set<UUID> submittedIds = assignmentIds.isEmpty()
            ? Set.of()
            : submissionRepository.findSubmittedAssignmentIds(studentId, assignmentIds);

        List<AssignmentDto> pending = allPublished.stream()
            .filter(a -> !submittedIds.contains(a.getId()))
            .sorted(Comparator.comparing(
                a -> a.getDueDate() != null ? a.getDueDate() : OffsetDateTime.MAX))
            .limit(10)
            .map(AssignmentDto::from)
            .toList();

        List<AssignmentDto> recentlySubmitted = allPublished.stream()
            .filter(a -> submittedIds.contains(a.getId()))
            .sorted(Comparator.comparing(Assignment::getUpdatedAt).reversed())
            .limit(10)
            .map(a -> AssignmentDto.from(a, SubmissionStatus.SUBMITTED))
            .toList();

        List<GrupoSummaryDto> grupoSummaries = grupos.stream()
            .map(g -> {
                int count = membershipRepository.findByGrupoIdAndActiveTrue(g.getId()).size();
                BigDecimal avg = gradeRepository
                    .findAverageScoreByStudentAndGrupo(studentId, g.getId())
                    .orElse(null);
                return GrupoSummaryDto.from(g, count, avg);
            })
            .toList();

        return new StudentDashboardDto(grupoSummaries, pending, recentlySubmitted);
    }
}
