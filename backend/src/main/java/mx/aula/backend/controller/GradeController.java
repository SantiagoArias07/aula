package mx.aula.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mx.aula.backend.dto.grade.GradeDto;
import mx.aula.backend.dto.grade.GradeRequest;
import mx.aula.backend.security.UserPrincipal;
import mx.aula.backend.service.GradeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/submissions/{submissionId}/grade")
@RequiredArgsConstructor
@Tag(name = "Calificaciones")
public class GradeController {

    private final GradeService gradeService;

    @PostMapping
    @Operation(summary = "Calificar entrega (docente)")
    public ResponseEntity<GradeDto> grade(
        @PathVariable UUID submissionId,
        @Valid @RequestBody GradeRequest req,
        @AuthenticationPrincipal UserPrincipal user
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(gradeService.grade(submissionId, req, user.getId()));
    }

    @PutMapping
    @Operation(summary = "Actualizar calificación (docente)")
    public ResponseEntity<GradeDto> updateGrade(
        @PathVariable UUID submissionId,
        @Valid @RequestBody GradeRequest req,
        @AuthenticationPrincipal UserPrincipal user
    ) {
        return ResponseEntity.ok(gradeService.updateGrade(submissionId, req, user.getId()));
    }

    @GetMapping
    @Operation(summary = "Ver calificación de una entrega")
    public ResponseEntity<GradeDto> getGrade(
        @PathVariable UUID submissionId,
        @AuthenticationPrincipal UserPrincipal user
    ) {
        return ResponseEntity.ok(gradeService.getGrade(submissionId, user.getId(), user.getRole()));
    }
}
