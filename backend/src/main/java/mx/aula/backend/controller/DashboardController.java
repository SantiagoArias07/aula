package mx.aula.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import mx.aula.backend.dto.dashboard.StudentDashboardDto;
import mx.aula.backend.dto.grade.GradeDto;
import mx.aula.backend.security.UserPrincipal;
import mx.aula.backend.service.DashboardService;
import mx.aula.backend.service.GradeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
@Tag(name = "Dashboard del Alumno")
public class DashboardController {

    private final DashboardService dashboardService;
    private final GradeService gradeService;

    @GetMapping("/dashboard")
    @Operation(summary = "Dashboard del alumno")
    public ResponseEntity<StudentDashboardDto> getDashboard(
        @AuthenticationPrincipal UserPrincipal user
    ) {
        return ResponseEntity.ok(dashboardService.getStudentDashboard(user.getId()));
    }

    @GetMapping("/grupos/{grupoId}/grades")
    @Operation(summary = "Mis calificaciones en un grupo")
    public ResponseEntity<List<GradeDto>> getGradesForGrupo(
        @PathVariable UUID grupoId,
        @AuthenticationPrincipal UserPrincipal user
    ) {
        return ResponseEntity.ok(gradeService.listGradesForStudent(grupoId, user.getId()));
    }
}
