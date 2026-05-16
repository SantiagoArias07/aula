package mx.aula.backend.dto.dashboard;

import mx.aula.backend.dto.assignment.AssignmentDto;
import mx.aula.backend.dto.grupo.GrupoSummaryDto;

import java.util.List;

public record StudentDashboardDto(
    List<GrupoSummaryDto> grupos,
    List<AssignmentDto> pendingAssignments,
    List<AssignmentDto> recentlySubmitted
) {}
